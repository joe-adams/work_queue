define(['backbone', 'ItemCollection', 'lodash', 'jquery', 'ItemView', 'workQueue'], function(Backbone, ItemCollection, _, $, ItemView, workQueue) {
    'use strict';
    return Backbone.View.extend({
        initialize: function(collection) {
            this.setElement($('#itemsView')[0]);
            this.collection = collection;
            _.bindAll(this, 'render', 'getView');
            Backbone.on('refreshView', this.render);
        },
        deleteInterval: null,
        appendInterval: null,
        render: function() {
            var views = this.collection.map(this.getView);
            var $el = this.$el;
            var $oldChildren = this.$el.children();
            $oldChildren.hide();
            clearInterval(this.appendInterval);
            this.appendInterval = workQueue(views, 20, 80, function(view) {
                $el.append(view.$el);
                view.$el.show();
            });
            Backbone.trigger('modal:loaded');
            return this;
        },
        childrenMap: {},
        getView: function(model) {
            var id = model.id;
            if (!this.childrenMap[id]) {
                this.childrenMap[id] = new ItemView(model);
            }
            return this.childrenMap[id];
        }
    });
});
