'use strict';

var MentionRegExp = /(?:[\s])@([A-Za-z0-9]+[A-Za-z0-9-]+)/g;

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

function prepareCommits(commits) {
    _.each(commits, function(commit) {
        commit.readableTimestamp = moment(commit.timestamp).fromNow();
        commit.parsedMessage = commit.message.replace(MentionRegExp, '');
    });
}

$(function() {
    initLinks();

    getFromStorage('commits').then(function(commits) {
        prepareCommits(commits);
        
        $('.mainview').height((58 * commits.length) + 30);
        $('#notifications').html(_.templates['row']({ commits: commits }));
    });
});
