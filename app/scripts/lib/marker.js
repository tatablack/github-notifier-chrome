/*jshint unused:false */
/*global $ */
var Marker = (function() {
    'use strict';

    var clearField = function(fieldName) {
        $(fieldName).removeClass('icon-cross icon-checkmark');
        $(fieldName + '-message').text('');
    };
    
    var markAsValid = function(fieldSelector, message) {
        $(fieldSelector).
            removeClass('icon-cross').
            addClass('icon-checkmark');
        
        $(fieldSelector + '-message').text(message);
    };
    
    var markAsInvalid = function(fieldSelector, message) {
        $(fieldSelector).
            removeClass('icon-checkmark').
            addClass('icon-cross');
        
        $(fieldSelector + '-message').text(message);
    };
    
    return {
        clearField: clearField,
        markAsValid : markAsValid,
        markAsInvalid : markAsInvalid
    };
})();
