importScripts("uninstall.js");

const TOKEN_URL = chrome.runtime.getURL("reload-token.txt");

async function check() {
  try {
    const res = await fetch(TOKEN_URL + "?t=" + Date.now(), { cache: "no-store" });
    const token = (await res.text()).trim();
    const { fwToken } = await chrome.storage.local.get("fwToken");
    if (fwToken === undefined) {
      await chrome.storage.local.set({ fwToken: token });
      return;
    }
    if (token !== fwToken) {
      await chrome.storage.local.set({ fwToken: token });
      chrome.runtime.reload();
    }
  } catch (e) {}
}

chrome.alarms.create("fw-dev-reload", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener(check);
chrome.runtime.onInstalled.addListener(check);
chrome.runtime.onStartup.addListener(check);
setInterval(check, 1500);
check();
