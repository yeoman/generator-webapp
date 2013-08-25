require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'<% if (compassBootstrap) { %>,
        bootstrapAffix: '../bower_components/sass-bootstrap/js/bootstrap-affix',
        bootstrapAlert: '../bower_components/sass-bootstrap/js/bootstrap-alert',
        bootstrapButton: '../bower_components/sass-bootstrap/js/bootstrap-button',
        bootstrapCarousel: '../bower_components/sass-bootstrap/js/bootstrap-carousel',
        bootstrapCollapse: '../bower_components/sass-bootstrap/js/bootstrap-collapse',
        bootstrapPopover: '../bower_components/sass-bootstrap/js/bootstrap-popover',
        bootstrapScrollspy: '../bower_components/sass-bootstrap/js/bootstrap-scrollspy',
        bootstrapTab: '../bower_components/sass-bootstrap/js/bootstrap-tab',
        bootstrapTooltip: '../bower_components/sass-bootstrap/js/bootstrap-tooltip',
        bootstrapTransition: '../bower_components/sass-bootstrap/js/bootstrap-transition',
        bootstrapTypeahead: '../bower_components/sass-bootstrap/js/bootstrap-typeahead'<% } %>
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
