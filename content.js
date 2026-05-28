// ===============================
// DEBUG VERSION – with console logs and visible border
// ===============================

// Add a green border to confirm content script is running
document.body.style.border = "5px solid #2c7a2c";
console.log("DEBUG: Green Search content script started");

const EXP_CONFIG = {
  condition: 'bandit',   // change to 'fixed-boost' for testing
  fixedBoostValue: 3,
  loggingEnabled: true
};

// Logger with debug output
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
    console.log(`DEBUG: Saved ${this.logs.length} logs to storage key ${this.storageKey}`);
  }
  async _loadFromStorage() {
    const result = await chrome.storage.local.get(this.storageKey);
    if (result[this.storageKey]) this.logs = result[this.storageKey];
    console.log(`DEBUG: Loaded ${this.logs.length} logs from storage`);
  }
  async logImpression(data) {
    if (!EXP_CONFIG.loggingEnabled) return;
    this.logs.push({ type: 'impression', ...data, timestamp: Date.now(), condition: this.condition });
    await this._saveToStorage();
    console.log(`DEBUG: Logged impression for ${data.domain}`);
  }
  async logClick(data) {
    if (!EXP_CONFIG.loggingEnabled) return;
    this.logs.push({ type: 'click', ...data, timestamp: Date.now(), condition: this.condition });
    await this._saveToStorage();
    console.log(`DEBUG: Logged click for ${data.domain}`);
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
console.log("DEBUG: Logger created, condition stored");

// Contextual Bandit
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

// Green Web API
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
    console.log(`🌱 Green check for ${domain}: ${green}`);
    await chrome.storage.local.set({ [cacheKey]: { isGreen: green, timestamp: Date.now() } });
    return green;
  } catch (err) {
    console.error("Green API error", domain, err);
    return false;
  }
}

// Re-ranking helpers
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

// Add visual badge and explainability to green results
function addGreenBadge(resultElement, domain) {
  const link = resultElement.querySelector('a');
  if (!link) return;
  if (link.querySelector('.green-badge')) return;
  const badge = document.createElement('span');
  badge.className = 'green-badge';
  badge.textContent = ' 🌿';
  badge.style.fontSize = '0.9em';
  badge.style.marginLeft = '6px';
  badge.style.cursor = 'help';
  badge.title = `Green-hosted (renewable energy)\nVerified by Green Web Foundation`;
  link.appendChild(badge);
}

function getSearchEngineInfo() {
  const url = window.location.href;
  if (url.includes('google.com')) return { engine: 'google', resultSelector: 'div.g', containerSelector: '#search' };
  if (url.includes('bing.com')) return { engine: 'bing', resultSelector: 'li.b_algo', containerSelector: '#b_results' };
  if (url.includes('duckduckgo.com')) return { engine: 'ddg', resultSelector: 'div.result', containerSelector: '.results' };
  return null;
}

// Helper: extract real domain from a Bing result element
function extractBingDomain(element) {
  // Method 1: data-url attribute (clean URL)
  let actualUrl = element.getAttribute('data-url');
  if (actualUrl) {
    try {
      const url = new URL(actualUrl);
      return url.hostname.replace(/^www\./, '');
    } catch(e) {}
  }
  
  // Method 2: find any link that points outside Bing
  const allLinks = element.querySelectorAll('a');
  for (const link of allLinks) {
    let href = link.href;
    if (!href || href.includes('bing.com') || href.startsWith('javascript:')) continue;
    
    // If it's a clean HTTP link, use it directly
    if (href.startsWith('http')) {
      try {
        const url = new URL(href);
        return url.hostname.replace(/^www\./, '');
      } catch(e) {}
    }
  }
  
  // Method 3: parse the redirect parameter from a Bing tracking link
  const redirectLink = element.querySelector('a[href*="/ck/a"]');
  if (redirectLink && redirectLink.href) {
    try {
      const url = new URL(redirectLink.href);
      // Bing often uses 'u' parameter to carry the encoded destination
      let encoded = url.searchParams.get('u');
      if (!encoded) encoded = url.searchParams.get('q');
      if (encoded) {
        const decoded = decodeURIComponent(encoded);
        if (decoded.startsWith('http')) {
          const destUrl = new URL(decoded);
          return destUrl.hostname.replace(/^www\./, '');
        }
      }
    } catch(e) {}
  }
  
  return null;
}

// Helper: extract real domain from Google result element
function extractGoogleDomain(element) {
  const link = element.querySelector('a');
  if (!link || !link.href) return null;
  let href = link.href;
  // Google sometimes uses redirects: /url?q=...
  if (href.includes('/url?q=')) {
    try {
      const url = new URL(href);
      const q = url.searchParams.get('q');
      if (q && q.startsWith('http')) {
        const destUrl = new URL(q);
        return destUrl.hostname.replace(/^www\./, '');
      }
    } catch(e) {}
  } else if (href.startsWith('http')) {
    try {
      const url = new URL(href);
      return url.hostname.replace(/^www\./, '');
    } catch(e) {}
  }
  return null;
}

// Helper: extract real domain from DuckDuckGo result element
function extractDDGDomain(element) {
  const link = element.querySelector('a');
  if (!link || !link.href) return null;
  let href = link.href;
  // DDG redirects: /l/?uddg=...
  if (href.includes('/l/')) {
    try {
      const url = new URL(href);
      const uddg = url.searchParams.get('uddg');
      if (uddg) {
        const destUrl = new URL(decodeURIComponent(uddg));
        return destUrl.hostname.replace(/^www\./, '');
      }
    } catch(e) {}
  } else if (href.startsWith('http')) {
    try {
      const url = new URL(href);
      return url.hostname.replace(/^www\./, '');
    } catch(e) {}
  }
  return null;
}

let observer = null;
async function rerankPage() {
  console.log("DEBUG: rerankPage called");
  const info = getSearchEngineInfo();
  if (!info) { console.log("DEBUG: Not a search page"); return; }
  const resultElements = Array.from(document.querySelectorAll(info.resultSelector));
  if (resultElements.length === 0) { console.log("DEBUG: No result elements found"); return; }
  console.log(`DEBUG: Found ${resultElements.length} results`);

  const resultsWithData = await Promise.all(resultElements.map(async (el, idx) => {
    let domain = '';
    
    if (info.engine === 'bing') {
      domain = extractBingDomain(el);
    } else if (info.engine === 'google') {
      domain = extractGoogleDomain(el);
    } else if (info.engine === 'ddg') {
      domain = extractDDGDomain(el);
    }
    
    if (domain) console.log(`Extracted domain: ${domain}`);
    else console.log(`Could not extract domain for result ${idx}`);
    
    const green = await isGreen(domain);
    return { element: el, domain, originalRank: idx + 1, isGreen: green };
  }));

  let banditMap = null;
  if (EXP_CONFIG.condition === 'bandit') {
    banditMap = new Map();
    for (const r of resultsWithData) {
      if (r.isGreen && r.domain && !banditMap.has(r.domain)) {
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
  
  // Add green badges after reordering
  for (const r of sorted) {
    if (r.isGreen) {
      addGreenBadge(r.element, r.domain);
    }
  }

  attachClickListeners(sorted, banditMap);
  console.log("DEBUG: Reranking complete, logs saved");
}

function startObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(() => rerankPage());
  observer.observe(document.body, { childList: true, subtree: true });
}

rerankPage();
startObserver();
console.log("Green Search Reranker active on", window.location.href);