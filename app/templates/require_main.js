require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'<% if (compassBootstrap) { %>,
        bootstrapAffix: '../bower_components/sass-bootstrap/js/bootstrap-affix.js',
        bootstrapAlert: '../bower_components/sass-bootstrap/js/bootstrap-alert.js',
        bootstrapButton: '../bower_components/sass-bootstrap/js/bootstrap-button.js',
        bootstrapCarousel: '../bower_components/sass-bootstrap/js/bootstrap-carousel.js',
        bootstrapCollapse: '../bower_components/sass-bootstrap/js/bootstrap-collapse.js',
        bootstrapPopover: '../bower_components/sass-bootstrap/js/bootstrap-popover.js',
        bootstrapScrollspy: '../bower_components/sass-bootstrap/js/bootstrap-scrollspy.js',
        bootstrapTab: '../bower_components/sass-bootstrap/js/bootstrap-tab.js',
        bootstrapTooltip: '../bower_components/sass-bootstrap/js/bootstrap-tooltip.js',
        bootstrapTransition: '../bower_components/sass-bootstrap/js/bootstrap-transition.js',
        bootstrapTypeahead: '../bower_components/sass-bootstrap/js/bootstrap-typeahead.js'<% } %>
    }<% if (compassBootstrap) { %>,
    shim: {
        bootstrapAffix: {
            deps: ['jquery']
        },
        bootstrapAlert: {
            deps: ['jquery']
        },
        bootstrapButton: {
            deps: ['jquery']
        },
        bootstrapCarousel: {
            deps: ['jquery']
        },
        bootstrapCollapse: {
            deps: ['jquery']
        },
        bootstrapPopover: {
            deps: ['jquery']
        },
        bootstrapScrollspy: {
            deps: ['jquery']
        },
        bootstrapTab: {
            deps: ['jquery']
        },
        bootstrapTooltip: {
            deps: ['jquery']
        },
        bootstrapTransition: {
            deps: ['jquery']
        },
        bootstrapTypeahead: {
            deps: ['jquery']
        }
    }<% } %>
});

require(['app', 'jquery'], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
