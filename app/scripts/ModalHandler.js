define(['backbone', 'jquery', 'lodash', 'bootstrap'], function(Backbone, $, _) {
    'use strict';
    return {
        counter: 0,
        $modal: null, //init onReady
        init: function() {
            _.bindAll(this, 'onReady', 'toggle', 'increment', 'decrement');
            $(document).ready(this.onReady);
            Backbone.on('modal:load', this.increment);
            Backbone.on('modal:loaded', this.decrement);
        },
        onReady: function() {
            this.$modal = $('#loading');
            this.toggle();
        },
        toggle: function() {
            if (!this.$modal) {
                return;
            }
            if (this.counter > 0) {
                this.$modal.modal('show');
            } else {
                this.$modal.modal('hide');
            }
        },
        increment: function() {
            this.counter++;
            this.toggle();
        },
        decrement: function() {
            this.counter--;
            this.toggle();
        }
    };
});
