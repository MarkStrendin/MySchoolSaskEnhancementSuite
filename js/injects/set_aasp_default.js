
function onSettingsLoaded(settings) 
{
    if (settings.sAASPDivNum && settings.sAASPDivNum.length > 0 && settings.lSetAASPDropdown) 
    {
        console.log("MSSES: Setting AASP drop down to division " + settings.sAASPDivNum);
        $("select[name='districtId']").val(settings.sAASPDivNum)
    }
}

var savedSettings = chrome.storage.sync.get(onSettingsLoaded);
