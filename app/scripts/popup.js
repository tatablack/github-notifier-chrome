/*jshint sub:true */
/*global chrome, moment, ChromeStorage */
'use strict';

var MentionRegExp = /(?:[\s])@([A-Za-z0-9]+[A-Za-z0-9-]+)/g;

function initLinks() {
    $('body').on('click', '.tag-clickable', function(evt) {
        chrome.tabs.create({ url: $(this).data('url') });
        evt.stopImmediatePropagation();
        return false;
    });

    $('body').on('click', 'a', function(evt) {
        if ($(this).attr('href')) {
            chrome.tabs.create({ url: $(this).attr('href') });
        }
        
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

    ChromeStorage.read('commits').then(function(result) {
        prepareCommits(result.commits);
        
        $('.mainview').height((58 * result.commits.length) + 12);
        $('#notifications').html(_.templates['row']({ commits: result.commits }));
    });
});
