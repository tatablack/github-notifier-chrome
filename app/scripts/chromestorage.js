/*jshint unused:false */
/*global chrome, Promise */
var ChromeStorage = (function() {
    'use strict';
    
    var read = function(key) {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get(key, function(result) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(result);
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
    
    var append = function(key, values) {
        read(key).then(function(result) {
            var data = {};
            
            if (!result) {
                data[key] = values;
            } else {
                data[key] = result.concat(values);
            }
            
            save(data);
        });
    };
    
    var remove = function(key) {
        chrome.storage.local.remove(key);
    };
    
    // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable/20463021#20463021
    var formatFileSizeIEC = function(a,b,c,d,e) {
        return (b = Math, c = b.log, d =1024, e = c(a)/c(d) | 0, a/b.pow(d,e)).
            toFixed(2) + ' ' + ( e ? 'KMGTPEZY'[--e] + 'iB' : 'Bytes');
    };

    var getUsage = function() {
        return new Promise(function(resolve, reject) {
            chrome.storage.local.getBytesInUse(null, function(bytesInUse) {
                if (chrome.runtime.lastError) {
                    console.error('github-notifier: unable to retrieve storage information. Error reported: %s', chrome.runtime.lastError.message);
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(formatFileSizeIEC(bytesInUse));
                }
            });
        });
    };
    
    return {
        read: read,
        save: save,
        append: append,
        remove: remove,
        getUsage: getUsage
    };
})();

