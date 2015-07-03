define(['backbone'], function(Backbone) {
    'use strict';
    return Backbone.Collection.extend({
        Model: Backbone.Model.extend({}),
        initialize: function() {
            var collection = this;
            Backbone.on("dataError", function(errorText) {
                collection.add(new this.Model({
                    errorText: errorText
                }));
            });
        },
        getErrorArray: function() {
            return this.map(function(model) {
                return model.get('errorText');
            });
        }
    });
});
