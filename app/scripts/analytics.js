/*jshint unused:false */
/*jshint sub:true */
/*global ga */
var Analytics = (function() {
    'use strict';
    
    
    var init = function() {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://ssl.google-analytics.com/analytics.js','ga');
    
        ga('create', { trackingId: 'UA-4904244-3', cookieDomain: 'auto' });
    };
    
    var trackPage = function(title) {
        ga('send', 'pageview', {'title': title});
    };
    
    var trackEvent = function(category, action, label) {
        ga('send', {
            'hitType': 'event',
            'eventCategory': category,
            'eventAction': action,
            'eventLabel': label
        });
    };
    
    return {
        init: init,
        trackPage: trackPage,
        trackEvent: trackEvent
    };
})();
