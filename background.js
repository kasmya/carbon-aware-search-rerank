// ===============================
// Configuration
// ===============================
const EXP_CONFIG = {
  condition: 'bandit',      // 'baseline', 'fixed-boost', 'bandit'
  fixedBoostValue: 3,
  loggingEnabled: true
};

// ===============================
// Logger with Storage
// ===============================
class Logger {
  constructor(sessionId, condition) {
    this.sessionId = sessionId;
    this.condition = condition;
    this.storageKey = `logs_${sessionId}`;
    this.logs = [];
    this._loadFromStorage();
  }
  async _saveToStorage() {
    await chrome.storage.local.set({ [this.storageKey]: this.logs });
  }
  async _loadFromStorage() {
    const result = await chrome.storage.local.get(this.storageKey);
    if (result[this.storageKey]) this.logs = result[this.storageKey];
  }
  async logImpression(data) {
    if (!EXP_CONFIG.loggingEnabled) return;
    this.logs.push({ type: 'impression', ...data, timestamp: Date.now(), condition: this.condition });
    await this._saveToStorage();
  }
  async logClick(data) {
    if (!EXP_CONFIG.loggingEnabled) return;
    this.logs.push({ type: 'click', ...data, timestamp: Date.now(), condition: this.condition });
    await this._saveToStorage();
  }
  async exportLogs() {
    if (this.logs.length === 0) { alert("No logs to export. Perform some searches first."); return; }
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${this.sessionId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async clearLogs() {
    this.logs = [];
    await this._saveToStorage();
    alert("Logs cleared.");
  }
}

const SESSION_ID = Date.now().toString();
const logger = new Logger(SESSION_ID, EXP_CONFIG.condition);
window.__logger = logger;
chrome.storage.local.set({ extensionCondition: EXP_CONFIG.condition });

// ===============================
// Contextual Bandit
// ===============================
class ContextualBandit {
  constructor(epsilon = 0.1, actions = [0, 2, 5]) {
    this.epsilon = epsilon;
    this.actions = actions;
    this.Q = null;
    this.domain = null;
  }
  async load(domain) {
    this.domain = domain;
    const key = `bandit_${domain}`;
    const result = await chrome.storage.local.get(key);
    if (result[key]) {
      this.Q = result[key];
    } else {
      this.Q = {};
      for (const a of this.actions) this.Q[a] = { value: 0, count: 0 };
      await this.save();
    }
  }
  async save() {
    const key = `bandit_${this.domain}`;
    await chrome.storage.local.set({ [key]: this.Q });
  }
  selectAction() {
    if (Math.random() < this.epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    } else {
      let bestAction = this.actions[0];
      let bestValue = this.Q[bestAction].value;
      for (const a of this.actions) {
        if (this.Q[a].value > bestValue) {
          bestValue = this.Q[a].value;
          bestAction = a;
        }
      }
      return bestAction;
    }
  }
  async update(action, reward) {
    if (!this.Q || !this.Q[action]) return;
    const old = this.Q[action];
    const newCount = old.count + 1;
    const newValue = old.value + (reward - old.value) / newCount;
    this.Q[action] = { value: newValue, count: newCount };
    await this.save();
  }
}

// ===============================
// Green Web API + Cache
// ===============================
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
async function isGreen(domain) {
  if (!domain) return false;
  const cacheKey = `green_${domain}`;
  const cached = await chrome.storage.local.get(cacheKey);
  if (cached[cacheKey] && (Date.now() - cached[cacheKey].timestamp) < CACHE_TTL_MS) {
    return cached[cacheKey].isGreen;
  }
  try {
    const url = `https://api.thegreenwebfoundation.org/greencheck/${domain}`;
    const response = await fetch(url);
    const data = await response.json();
    const green = data.green === true;
    await chrome.storage.local.set({ [cacheKey]: { isGreen: green, timestamp: Date.now() } });
    return green;
  } catch (err) {
    console.error("Green API error", domain, err);
    return false;
  }
}

// ===============================
// Re-ranking Helpers
// ===============================
function computeBoosts(results, condition, fixedBoostValue, banditMap) {
  if (condition === 'baseline') return results.map(r => ({ ...r, boost: 0 }));
  if (condition === 'fixed-boost') return results.map(r => ({ ...r, boost: r.isGreen ? fixedBoostValue : 0 }));
  if (condition === 'bandit' && banditMap) {
    return results.map(r => {
      let boost = 0;
      if (r.isGreen && banditMap.has(r.domain)) boost = banditMap.get(r.domain).selectAction();
      return { ...r, boost };
    });
  }
  return results;
}
function sortByBoost(results) {
  return [...results].sort((a, b) => (a.originalRank - a.boost) - (b.originalRank - b.boost));
}
function applyReordering(container, sortedResults) {
  for (const r of sortedResults) container.appendChild(r.element);
}
function attachClickListeners(results, banditMap) {
  for (const r of results) {
    if (r.element._clickHandler) r.element.removeEventListener('click', r.element._clickHandler);
    const handler = async () => {
      setTimeout(async () => {
        await logger.logClick({ domain: r.domain, rank: r.newRank, wasGreen: r.isGreen });
        if (r.isGreen && r.boost > 0 && banditMap && banditMap.has(r.domain)) {
          await banditMap.get(r.domain).update(r.boost, 1);
        }
      }, 50);
    };
    r.element._clickHandler = handler;
    r.element.addEventListener('click', handler);
  }
}

// ===============================
// Search Engine Detection
// ===============================
function getSearchEngineInfo() {
  const url = window.location.href;
  if (url.includes('google.com')) return { engine: 'google', resultSelector: 'div.g', containerSelector: '#search' };
  if (url.includes('bing.com')) return { engine: 'bing', resultSelector: 'li.b_algo', containerSelector: '#b_results' };
  if (url.includes('duckduckgo.com')) return { engine: 'ddg', resultSelector: 'div.result', containerSelector: '.results' };
  return null;
}

// ===============================
// Main Reranking Function
// ===============================
let observer = null;
async function rerankPage() {
  const info = getSearchEngineInfo();
  if (!info) return;
  const resultElements = Array.from(document.querySelectorAll(info.resultSelector));
  if (resultElements.length === 0) return;

  const resultsWithData = await Promise.all(resultElements.map(async (el, idx) => {
    const link = el.querySelector('a');
    let domain = '';
    if (link) {
      try {
        const url = new URL(link.href);
        domain = url.hostname.replace(/^www\./, '');
      } catch(e) {}
    }
    const green = await isGreen(domain);
    return { element: el, domain, originalRank: idx + 1, isGreen: green };
  }));

  let banditMap = null;
  if (EXP_CONFIG.condition === 'bandit') {
    banditMap = new Map();
    for (const r of resultsWithData) {
      if (r.isGreen && !banditMap.has(r.domain)) {
        const b = new ContextualBandit();
        await b.load(r.domain);
        banditMap.set(r.domain, b);
      }
    }
  }

  const boosted = computeBoosts(resultsWithData, EXP_CONFIG.condition, EXP_CONFIG.fixedBoostValue, banditMap);
  const sorted = sortByBoost(boosted);
  for (let i = 0; i < sorted.length; i++) sorted[i].newRank = i + 1;

  for (const r of sorted) {
    await logger.logImpression({
      domain: r.domain,
      originalRank: r.originalRank,
      newRank: r.newRank,
      boost: r.boost,
      isGreen: r.isGreen,
      action: r.boost
    });
  }

  const container = document.querySelector(info.containerSelector);
  if (container) applyReordering(container, sorted);
  attachClickListeners(sorted, banditMap);
}

function startObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(() => rerankPage());
  observer.observe(document.body, { childList: true, subtree: true });
}

rerankPage();
startObserver();
console.log("Green Search Reranker active on", window.location.href);