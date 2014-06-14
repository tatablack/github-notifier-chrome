/*jshint unused:false */
/*global console, moment */
var Console = (function() {
    'use strict';

    var getTimestamp = function() {
        var localMoment = moment();
        localMoment.lang('en');
        return localMoment.format('YYYY-MM-DD h:mm:ss.SSS');
    };

    var wrappers = {
        log: console.log.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console)        
    };
     
    var output = function(type, args) {
        if (!args.length) { return; }

        var customArgs = Array.prototype.slice.call(args, 0),
            timestamp = '[' + getTimestamp() + ']';

        if (typeof args[0] === 'string') {
            customArgs[0] = '%s ' + args[0];
            customArgs.splice(1, 0, timestamp);
            wrappers[type].apply(this, customArgs);            
        } else {
            customArgs.splice(0, 0, timestamp);
            wrappers[type].apply(this, customArgs);            
        }
    };
    
    var log = function() {
        output('log', arguments);
    };
    
    var info = function() {
        output('info', arguments);
    };
    
    var warn = function() {
        output('warn', arguments);
    };
    
    var error = function() {
        output('error', arguments);
    };
    
    return {
        log: log,
        info: info,
        warn: warn,
        error: error
    };
})();
