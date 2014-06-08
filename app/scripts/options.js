'use strict';

var urlRegExp = /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
    usernameRegExp = /^[a-zA-Z0-9]+[a-zA-Z0-9\-]*$/;

var currentRequest;

var extensionMessagesSuccess = humane.create({ baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-success' }),
    extensionMessagesError = humane.create({ timeout: 5000, clickToClose: true, baseCls: 'humane-jackedup', addnCls: 'humane-jackedup-error' });

function checkAvailability(url) {
    if (!url) {
        return;
    }
    
    if (currentRequest) {
        console.log('A request was already executing');
        currentRequest.abort();
    }
    
    currentRequest = $.ajax({
        url: url + '/ping',
        success: function(response) {
            $('.listener-validation').
                removeClass('icon-cross').
                addClass('icon-checkmark').
                text('Github Listener v' + response.version + ' found');
        },
        error: function(status, statusText, responseText) {
            $('.listener-validation').
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
    
    if ($('.listener-validation').hasClass('icon-checkmark')) {
        options['listener'] = $('#listener').val();
    }
    
    return options;
}

function initOptions() {
    chrome.storage.sync.get('username', function(result) {
        $('#username').val(result.username);
        checkUsernameValidity(result.username);
    });

    chrome.storage.sync.get('listener', function(result) {
        $('#listener').val(result.listener);
        checkAvailability(result.listener);
    });
}

function checkUsernameValidity(username) {
    if (!username) {
        return;
    }
    
    if (usernameRegExp.test(username)) {
        $('.user-validation').
            removeClass('icon-cross').
            addClass('icon-checkmark').
            text('This seems a valid GitHub username');
    } else {
        $('.user-validation').
            removeClass('icon-checkmark').
            addClass('icon-cross').
            text('Invalid username');
        
        extensionMessagesError.log('GitHub usernames may only contain alphanumeric<br>characters or dashes and cannot begin with a dash');
    }
}

$(function() {
    var debouncedCheckAvailability = _.debounce(checkAvailability, 200);
    
    initOptions();
    
    $('#username').on('input', function() {
        console.log(this.value);
        checkUsernameValidity(this.value);
    });
    
    $('#listener').on('input', function() {
        if (urlRegExp.test(this.value)) {
            debouncedCheckAvailability(this.value);
        }
    });
    
    $('#saveButton').on('click', function(evt) {
        evt.preventDefault();
        
        chrome.storage.sync.set(getOptions(), function() {
            extensionMessagesSuccess.log('Options saved');
        });
    });

    $('#closeButton').on('click', function() {
        self.close();
    });
});
