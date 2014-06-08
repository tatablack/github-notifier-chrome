'use strict';

function getFromStorage(key) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(key, function(result) {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError));
            } else {
                resolve(result[key]);
            }
        });
    });
}

$(function() {
    getFromStorage('commits').then(function(commits) {
        // Here we should do some pre-formatting of our data
        // (like moment(commit.timestamp).fromNow(); )
        // ..unless we want to do it in the template
        $('body').html(_.templates['row']({ commits: commits }));
    });
});
