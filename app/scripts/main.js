/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'lodash',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap',
        text: '../bower_components/requirejs-text/text',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        handlebars: '../bower_components/handlebars/handlebars',
        moment: '../bower_components/moment/moment',
        hjson: 'vendor/hjson',
        lodash: '../bower_components/lodash/lodash'
    }
});

require([
    'start',
]);
