/*jshint unused:false */
/*global ChromeStorage, uuid */
var Installation = (function() {
    'use strict';

    var ensureId = function() {
        ChromeStorage.read('installation').then(
            function(result) {
                if (!result) {
                    ChromeStorage.save({ installation: { installationId: uuid.v4(), registered: false } });
                }
            },
            function(error) {
                console.error('Unable to create an installation ID: ' + error);
            }
        );
    };
    
    return {
        ensureId: ensureId
    };
})();
