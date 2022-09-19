const allCheckBoxes = [];

function checkBoxes(startIndex,endIndex,allCheckboxes)
{
    var first = startIndex;
    var last = endIndex;

    if (first >= 0 && last >= 0 && first != last)
    {
        // Make sure we're working from top to bottom even if the user click bottom to top
        if (first > last)
        {
            var temp = first;
            first = last;
            last = temp;
        }

        // Select the boxes
        for(let x = first; x < last; x++)
        {
            $(allCheckboxes[x]).prop('checked', true);
        }
    }
}

function findIndexOfCheckbox(checkbox, allCheckboxes)
{
    // Find the last checked box in the array
    var index = 0;

    // Find the indexes of the selected boxes
    for(let x = 0; x < (allCheckBoxes.length) - 1; x++)
    {
        if (allCheckBoxes[x].attr('id') == $(checkbox).attr('id'))
        {
            index = x;
        }
    }

    return index;
}

function onSettingsLoaded(settings)
{
    if (settings.lEnableCheckboxMultiSelect == true)
    {
        console.log("MSSES: Enabling shift+clicking checkboxes");

        var firstIndex = 0;
        var lastIndex = 0;

        $("input[type='checkbox']").each(
            function()
            {
                allCheckBoxes.push($(this));
                
                $(this).on('click',function(e) {
                    if (e.shiftKey && firstIndex != 0)
                    {
                        lastIndex = findIndexOfCheckbox($(this), allCheckBoxes);                        

                        if (firstIndex > 0 && lastIndex > 0 && firstIndex != lastIndex)
                        {
                            checkBoxes(firstIndex,lastIndex,allCheckBoxes);

                            // Reset the indexes
                            firstIndex = 0;
                            lastIndex = 0;
                        }

                    } else {
                        firstIndex = findIndexOfCheckbox($(this), allCheckBoxes);
                    }
                });
            }
        );
      
    }
}

var savedSettings = chrome.storage.sync.get(onSettingsLoaded);
