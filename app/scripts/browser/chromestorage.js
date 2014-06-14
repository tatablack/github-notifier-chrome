/*jshint unused:false */
/*global _, Console, chrome, Promise */
var ChromeStorage = (function() {
    'use strict';
    
    var read = function(key) {
        return new Promise(function readPromise(resolve, reject) {
            chrome.storage.local.get(key, function storageGetCallback(result) {
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
            Console.error('github-notifier: unable to save. Error reported: %s', chrome.runtime.lastError.message);
        }
    };
    
    
    var save = function(object, callback) {
        chrome.storage.local.set(object, callback || defaultCallback);
    };
    
    var increment = function(key, value) {
        Console.log('Trying to increment %s with %d', key, value);
        read(key).then(function afterIncrement(result) {
            var data = {};
            
            if (!result[key]) {
                data[key] = value;
            } else {
                data[key] = result[key] + value;
            }
            
            save(data);
        }).
        catch(function(error) {
            Console.error('github-notifier: error while reading %s from storage: %s', key, error.message);
        });
    };
    
    var appendToArray = function(key, values) {
        read(key).then(function afterAppendToArray(result) {
            var data = {};
            
            if (!result[key]) {
                data[key] = values;
            } else {
                data[key] = result[key].concat(values);
            }
            
            save(data);
        }).
        catch(function(error) {
            Console.error('github-notifier: error while reading %s from storage: %s', key, error.message);
        });
    };
    
    var remove = function(key) {
        chrome.storage.local.remove(key);
    };
    
    var removeFromArray = function(key, name, valueToRemove, callback) {
        read(key).then(function afterRemoveFromArray(result) {
            var updatedResult = {};
            
            updatedResult[key] = _.filter(result[key], function(value) {
                return value[name] !== valueToRemove;
            });

            save(updatedResult, callback);
        }).
        catch(function(error) {
            Console.error('github-notifier: error while reading %s from storage: %s', key, error.message);
        });
    };
    
    // https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable/20463021#20463021
    var formatFileSizeIEC = function(a, b, c, d, e) {
        return (b = Math, c = b.log, d =1024, e = c(a)/c(d) | 0, a/b.pow(d,e)).
            toFixed(2) + ' ' + ( e ? 'KMGTPEZY'[--e] + 'iB' : 'Bytes');
    };

    var getUsage = function() {
        return new Promise(function getUsagePromise(resolve, reject) {
            chrome.storage.local.getBytesInUse(null, function afterGetBytesInUse(bytesInUse) {
                if (chrome.runtime.lastError) {
                    Console.error('github-notifier: unable to retrieve storage information. Error reported: %s', chrome.runtime.lastError.message);
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
        appendToArray: appendToArray,
        increment: increment,
        remove: remove,
        removeFromArray: removeFromArray,
        getUsage: getUsage
    };
})();

