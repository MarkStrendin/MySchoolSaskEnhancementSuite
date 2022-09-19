
function logMsg(msg) {
  console.log("MSSES: " + msg);
}

$("#chkShowItWorks").on('change', function() {
  chrome.storage.sync.set({
    lShowItWorksBanner: document.querySelector("#chkShowItWorks").checked
  });
});

$("#chkEnableAASPSelect").on('change', function() {
  chrome.storage.sync.set({
    lSetAASPDropdown: document.querySelector("#chkEnableAASPSelect").checked
  });
});

$("#txtAASPSchoolDiv").on('input', function() {
  chrome.storage.sync.set({
    sAASPDivNum: document.querySelector("#txtAASPSchoolDiv").value
  });
});

$("#chkShowDebugOptions").on('change', function() {
  var lShowDebugOptions = document.querySelector("#chkShowDebugOptions").checked || false;
  if (lShowDebugOptions == true) {
    $("#divDebugOptions").slideDown();
  } else {
    $("#divDebugOptions").slideUp();
  }
});


$("#btnClearLocalStorage").on('click', function() {
  logMsg("Clearing sync settings");
  chrome.storage.sync.clear();

  logMsg("Clearing local settings");
  chrome.storage.local.clear();

  alert("Extension local and sync data cleared. Note that refreshing or navigating to the options screen will automatically write settings to local and synced storage.");
});

$("#btnResetSettingsToDefault").on('click', function() {
  chrome.storage.sync.clear();
  chrome.storage.sync.set({
    lShowItWorksBanner: false,
    lEnableCheckboxMultiSelect: true,
    lSetAASPDropdown: false,
    sAASPDivNum: ""
  });
  location.reload();
});

$("#chkEnableCheckboxMultiSelect").on('change', function() {
  chrome.storage.sync.set({
    lEnableCheckboxMultiSelect: document.querySelector("#chkEnableCheckboxMultiSelect").checked
  });
});

function checkDefaultSettings(settings) {
  if (settings.lShowItWorksBanner == null) {
    logMsg("Defaulting new setting \"lShowItWorksBanner\" to false");
    chrome.storage.sync.set({
      lShowItWorksBanner: false
    });
  }

  if (settings.lEnableCheckboxMultiSelect == null) {
    logMsg("Defaulting new setting \"lEnableCheckboxMultiSelect\" to true");
    chrome.storage.sync.set({
      lEnableCheckboxMultiSelect: true
    });
  }

  if (settings.lSetAASPDropdown == null) {
    logMsg("Defaulting new setting \"lSetAASPDropdown\" to false");
    chrome.storage.sync.set({
      lSetAASPDropdown: false
    });
  }

  if (settings.sAASPDivNum == null) {
    logMsg("Defaulting new setting \"sAASPDivNum\" to ''");
    chrome.storage.sync.set({
      sAASPDivNum: ""
    });
  }
}

/// Visually updates the fields on the options page to match the stored settings, or the defauls
function onSyncSettingsLoaded(settings) {
  checkDefaultSettings(settings);

  // Debug banner
  document.querySelector("#chkShowItWorks").checked = (settings.lShowItWorksBanner || false);

  // Checkbox multiselect
  document.querySelector("#chkEnableCheckboxMultiSelect").checked = (settings.lEnableCheckboxMultiSelect || false);

  // AASP 
  document.querySelector("#chkEnableAASPSelect").checked = (settings.lSetAASPDropdown || false);
  document.querySelector("#txtAASPSchoolDiv").value = (settings.sAASPDivNum || "");
 
}

function onLocalSettingsLoaded(settings) {
  var isFirstRunText = "Yes";
  if (settings.hascompletedfirstrun == true) {
    isFirstRunText = "No";
  }

  var lastVersionSeenText = "Unknown";
  if (settings.lastversionseen != null) {
    lastVersionSeenText = "v" + settings.lastversionseen;
  }

  $("#lblFirstRun").text(isFirstRunText);
  $("#lblLastVersionSeen").text(lastVersionSeenText);

  // If this is the first time the extension has been run, indicate that we've seen the options screen
  if (settings.hascompletedfirstrun != true) {
    chrome.storage.local.set({
      hascompletedfirstrun: true
    });
  }

  // Save the last version of this addon that we've seen, so we can detect updates
  chrome.storage.local.set({
    lastversionseen: chrome.runtime.getManifest().version
  });
}

function updateFields() {
  var savedSettings = chrome.storage.local.get(onLocalSettingsLoaded);
  var savedSettings = chrome.storage.sync.get(onSyncSettingsLoaded);
}

$("#lblExtensionVersion").text("v" + chrome.runtime.getManifest().version);
document.addEventListener("DOMContentLoaded", updateFields);

// Check if we should show the "new version" or "new install" info boxes
if (window.location.href.indexOf('justInstalled=true') != -1) {
  $("#newInstallMessage").show();
}

if (window.location.href.indexOf('justUpdated=true') != -1) {
  $("#newVersionMessage").show();
}