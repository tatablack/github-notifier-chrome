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

function initLinks() {
    $('body').on('click', 'a', function(evt) {
        chrome.tabs.create({ url: $(this).attr('href') });
        return false;
    });

    $('body').on('click', '.tag-clickable', function(evt) {
        chrome.tabs.create({ url: $(this).data('url') });
        return false;
    });
}

$(function() {
    initLinks();

    getFromStorage('commits').then(function(commits) {
        // Here we should do some pre-formatting of our data
        // (like moment(commit.timestamp).fromNow(); )
        // ..unless we want to do it in the template
        $('.mainview').height((58 * commits.length) + 30);
        $('#notifications').html(_.templates['row']({ commits: commits }));
    });
});
