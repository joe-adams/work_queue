define(['backbone', 'lodash', 'hbs!../template/noErrors', 'hbs!../template/errors'], function(Backbone, _, noErrors, errors) {
    'use strict';
    return Backbone.View.extend({
        noErrors: noErrors,
        errors: errors,
        initialize: function(collection) {
            _.bindAll(this, 'render');
            this.setElement($('#errorsView')[0]);
            this.collection = collection;
            this.collection.on('add', this.render);
            this.render();
        },
        render: function() {
            if (this.collection.length === 0) {
                this.$el.html(this.noErrors());
            } else {
                var errors = this.collection.getErrorArray();
                this.$el.html(this.errors(errors));
            }
        }
    });
});
