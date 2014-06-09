var ChromeStorage = (function() {
    'use strict';
    
    var read = function(key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get(key, function(result) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve(result[key]);
                }
            });
        });
    };
    
    var defaultCallback = function() {
        if (chrome.runtime.lastError) {
            console.error('github-notifier: unable to save. Error reported: %s', chrome.runtime.lastError.message);
        }
    };
    
    var save = function(object, callback) {
        chrome.storage.local.set(object, callback || defaultCallback);
    };
    
    return {
        read: read,
        save: save
    };
})();
