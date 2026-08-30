const UNINSTALL_PAGE = "https://flightwifi.app/uninstall/";

function setUninstallPage() {
  try {
    const { version } = chrome.runtime.getManifest();
    chrome.runtime.setUninstallURL(`${UNINSTALL_PAGE}?v=${encodeURIComponent(version)}`);
  } catch (e) {}
}

setUninstallPage();
chrome.runtime.onInstalled.addListener(setUninstallPage);
chrome.runtime.onStartup.addListener(setUninstallPage);
