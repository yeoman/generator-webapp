require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery'<% if (compassBootstrap) { %>,
        bootstrap: 'vendor/bootstrap'<% } %>
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['app', 'jquery'<% if (compassBootstrap) { %>, 'bootstrap'<% } %>], function (app, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
