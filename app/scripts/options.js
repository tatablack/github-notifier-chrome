'use strict';

var UrlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
var currentRequest;

function checkAvailability(url) {
    if (currentRequest) {
        console.log('A request was already executing');
        currentRequest.abort();
    }
    
    currentRequest = $.ajax({
        url: url + '/ping',
        success: function(response) {
            $('.availability').
                removeClass('icon-cross').
                addClass('icon-checkmark').
                text('Github Listener v' + response.version + ' found');
        },
        error: function(status, statusText, responseText) {
            $('.availability').
                removeClass('icon-checkmark').
                addClass('icon-cross').
                text('Server not available');
        },
        complete: function() {
            currentRequest = null;            
        }
    });
}

function getOptions() {
    var options = {
        'username': $('#username').val()
    };
    
    if ($('.availability').hasClass('icon-checkmark')) {
        options['listener'] = $('#listener').val();
    }
    
    return options;
}

function initOptions() {
    chrome.storage.sync.get('username', function(result) {
        $('#username').val(result.username);
    });

    chrome.storage.sync.get('listener', function(result) {
        $('#listener').val(result.listener);
    });
}

$(function() {
    var debouncedCheckAvailability = _.debounce(checkAvailability, 200);
    
    initOptions();
    
    $('#listener').on('input', function() {
        if (UrlRegExp.test(this.value)) {
            debouncedCheckAvailability(this.value);
        };
    });
    
    $('#saveButton').on('click', function() {
        chrome.storage.sync.set(getOptions());
        //self.close();
    });
});


function isUrl(s) {
	var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	return regexp.test(s);
}

