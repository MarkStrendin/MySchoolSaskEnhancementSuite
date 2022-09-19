function onSettingsLoaded(settings) 
{
    if (settings.lShowItWorksBanner == true) 
    {
        console.log("MSSES: It works!");
        $("body").before("<div style=\"z-index:1; position: absolute; font-size: 8pt; margin: 0; padding: 0; width: 100%; background-color: yellow; color: black;text-align: center;font-family: sans-serif;\">MySchoolSask Enhancement Suite is able to modify the contents of this page.</div>");
	}
}

var savedSettings = chrome.storage.sync.get(onSettingsLoaded);
