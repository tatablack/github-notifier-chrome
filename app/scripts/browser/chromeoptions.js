/*jshint unused:false */
/*jshint -W079 */
var ChromeOptions = (function() {
    'use strict';
    
    var optionsUrl = chrome.extension.getURL('options.html');

    var open = function() {
        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) {
                chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                chrome.tabs.create({url: optionsUrl});
            }
        });
    };

    return {
        open: open
    };
})();


