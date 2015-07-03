require([
    'backbone',
    'ItemCollection',
    'ItemsView',
    'ErrorCollection',
    'ErrorsView',
    'lodash',
    'HandleInput',
    'configJson',
    'ModalHandler',
    'bootstrap'
], function(Backbone, ItemCollection, ItemsView, ErrorCollection, ErrorsView, _, handleInput, configJson, modalHandler) {
    "use strict";
    configJson();
    modalHandler.init();
    var errors = new ErrorCollection();
    new ErrorsView(errors);
    var collection = new ItemCollection();
    new ItemsView(collection);
    var ajaxs = ['json/test.json', 'json/test2.json', 'json/test3.json', 'json/test4.json', 'json/test5.json'];
    //var ajaxs=['json/test.json'];
    if (ajaxs.length > 0) {
        Backbone.trigger('modal:load');
    }

    var renderAll = _.after(ajaxs.length, function() {
        Backbone.trigger('refreshView');
    });
    _.each(ajaxs, function(ajax) {
        collection.getFromServer(ajax, renderAll);
    });
    handleInput(collection);
});
