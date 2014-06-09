var ChromeStorage = (function() {
    'use strict';
    
    var read = function(key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(key, function(result) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError));
                } else {
                    resolve(result[key]);
                }
            });
        });
    };
    
    var save = function(key, value) {
        var toStore = {};
        toStore[key] = value;
        
        chrome.storage.sync.set(toStore, function() {
            if (chrome.runtime.lastError) {
                console.error('github-notifier: unable to save %s. There was an error: %s', key, chrome.runtime.lastError.message);
            }
        });
    };
    
    return {
        read: read,
        save: save
    };
})();
