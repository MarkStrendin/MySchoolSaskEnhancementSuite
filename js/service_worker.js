
var MSSES_VERSION = chrome.runtime.getManifest().version


// Local settings are used to store:
//  - If this is a new install or not
//  - The last seen version, to check if we've been updated
function onLocalSettingsLoaded(settings) {
	// Open the options screen if this is the first time the addon has been run
	if (settings.hascompletedfirstrun != true) {
		console.log("Showing first run options page");
		chrome.tabs.create({
			url: chrome.runtime.getURL('./pages/options.html?justInstalled=true'),
			active: true
		});
	} else if (settings.lastversionseen != MSSES_VERSION) {
		console.log("Showing updated options page");
		// Check if this is a newer version than the user had installed
		
		// What should we do if the extension is a different version than last seen?		
		chrome.tabs.create({
			url: chrome.runtime.getURL('./pages/options.html?justUpdated=true'),
			active: true
		});
	}
}

// Sync settings are used to store:
//  - All user configurable settings
function onSyncSettingsLoaded(settings) {
	// We don't need to do anything here right now, but we might in the future.
}

console.log("Loading MySchoolSask Enhancement Suite " + MSSES_VERSION);
var savedSettings = chrome.storage.local.get(onLocalSettingsLoaded);
var savedSettings = chrome.storage.sync.get(onSyncSettingsLoaded);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => 
{
	// Make sure we're on the correct website.
    if (changeInfo.status === 'complete' && /^http.*myschoolsask.*aspen.*$/.test(tab.url)) 
	{
		// Auto select the selected drop-down	
		if (tab.url.toLowerCase().includes("logon.do")) 
		{
			chrome.scripting
				.executeScript({ target: { tabId: tabId }, files: ["./js/injects/set_aasp_default.js"]})
				.then(() => { })
				.catch(err => console.log(err));
		}

		// Show "it works"
		chrome.scripting
			.executeScript({ target: { tabId: tabId }, files: ["./js/injects/itworks.js"]})
			.then(() => { })
			.catch(err => console.log(err));	

		
		chrome.scripting
			.executeScript({ target: { tabId: tabId }, files: ["./js/injects/add_shift_click_checkboxes.js"]})
			.then(() => { })
			.catch(err => console.log(err));
		
	}
});