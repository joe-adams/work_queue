define(['backbone', 'ItemCollection', 'lodash', 'jquery', 'hbs!../template/itemView'], function(Backbone, ItemCollection, _, $, template) {
    'use strict';
    return Backbone.View.extend({
        template: template,
        initialize: function(model) {
            _.bindAll(this, 'render', 'statusChange');
            this.model = model;
            this.render();
            this.model.on('change:statusMessage', this.statusChange);
        },
        render: function() {
            var $html = $(this.template(this.model.attributes));
            this.setElement($html[0]);
            return this;
        },
        statusChange: function() {
            this.$el.find('[data-role=statusMessage]').html(this.model.get('statusMessage'));
        }
    });
});
