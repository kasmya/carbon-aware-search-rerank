// src/popup/popup.js

// Display current condition
async function displayCondition() {
  const result = await chrome.storage.local.get(['extensionCondition']);
  const condition = result.extensionCondition || 'not set';
  document.getElementById('condition').innerText = condition;
}

// Count total logs stored and green sites boosted
async function updateStats() {
  const all = await chrome.storage.local.get(null);
  let totalLogs = 0;
  let greenSiteCount = 0;

  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith('logs_') && Array.isArray(value)) {
      totalLogs += value.length;
      // Count unique green impressions (simplified: count entries where isGreen = true)
      const greenEntries = value.filter(entry => entry.isGreen === true);
      greenSiteCount += greenEntries.length;
    }
  }

  document.getElementById('greenCount').innerText = greenSiteCount;
  document.getElementById('logCount').innerText = totalLogs;
}

// Get all logs from storage (all keys starting with "logs_")
async function getAllLogs() {
  const all = await chrome.storage.local.get(null);
  const logs = [];
  for (const [key, value] of Object.entries(all)) {
    if (key.startsWith('logs_') && Array.isArray(value)) {
      logs.push(...value);
    }
  }
  return logs;
}

// Export all logs as a single JSON file
async function exportAllLogs() {
  const logs = await getAllLogs();
  if (logs.length === 0) {
    alert("No logs found. Perform searches first.");
    return;
  }
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `all_logs_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Clear all logs from storage (remove all keys starting with "logs_")
async function clearAllLogs() {
  if (!confirm("Delete all logs? This cannot be undone.")) return;
  const all = await chrome.storage.local.get(null);
  const keysToRemove = Object.keys(all).filter(k => k.startsWith('logs_'));
  if (keysToRemove.length === 0) {
    alert("No logs to clear.");
    return;
  }
  await chrome.storage.local.remove(keysToRemove);
  alert(`Cleared ${keysToRemove.length} log entries.`);
  // Refresh stats after clearing
  await updateStats();
}

// Attach button handlers
document.getElementById('exportBtn').addEventListener('click', exportAllLogs);
document.getElementById('clearBtn').addEventListener('click', clearAllLogs);

// Initial load
displayCondition();
updateStats();