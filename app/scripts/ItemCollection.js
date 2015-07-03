define(['backbone', 'ItemModel', 'lodash'], function(Backbone, ItemModel, _) {
    'use strict';
    return Backbone.Collection.extend({
        model: ItemModel,
        initialize: function() {

        },
        parse: function(resp) {
            return _.map(resp.DATA, function(item) {
                return new ItemModel(item);
            });
        },
        comparator: function(m1, m2) {
            var s1 = m1.get('sort');
            var s2 = m2.get('sort');
            var sCompare = s1 - s2;
            if (sCompare !== 0) {
                return sCompare;
            }
            var c1 = m1.get('completionDate');
            var c2 = m2.get('completionDate');
            if ((c1 == null) || (c2 == null)) {
                return 0;
            }
            return c1.diff(c2);
        },
        getFromServer: function(url, callback) {
            this.url = url;
            var error = _.bind(this.fetchError, this, url, callback);
            this.fetch({
                success: callback,
                error: error
            });
        },
        fetchError: function(url, callback) {
            Backbone.trigger('dataError', 'Error retrieving data from: ' + url);
            callback();
        },
        readFile: function(filename, event) {
            try {
                var string = event.target.result;
                var json = JSON.parse(string);
                this.add(json.DATA, {
                    sync: false
                });
                Backbone.trigger('refreshView');
            } catch (error) {
                Backbone.trigger('dataError', 'Error reading file: ' + filename);
            }
        }
    });
});
