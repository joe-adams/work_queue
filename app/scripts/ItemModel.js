define(['backbone', 'status', 'moment', 'handlebars', 'lodash'], function(Backbone, Status, moment, handlebars, _) {
    'use strict';
    return Backbone.Model.extend({
        inTimeFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZZ',
        outTimeFormat: 'MM/DD/YYYY hh:mm a',
        initialize: function() {
            _.bindAll(this, 'statusMessage');
            this.set('initTime', moment());
            var statusEnum = Status.findStatus(this);
            this.set('statusEnum', statusEnum);
            if (!this.get('processed')) {
                this.set('processed', 0);
            }
            this.set('css', statusEnum.css);
            this.momentify('request_date');
            this.momentify('start_date');
            this.momentify('end_date');
            this.bytes('processed');
            this.bytes('total');
            var niceStatus = handlebars.escapeExpression(this.get('status'));
            niceStatus = niceStatus.replace(/\bsuccess\b/i, '<strong>Success</strong>').replace(/\bfail\b/i, '<strong>Fail</strong>').replace(/\berror\b/i, '<strong>Error</strong>');
            this.set('status', niceStatus);
            this.statusMessage();
            var mySort = statusEnum.sort;
            if (this.get('end_date')) {
                this.set('completionDate', this.get('end_date'));
            } else if (this.get('expectedCompletionDate')) {
                statusEnum.expectedCompletionDate(this);
                this.set('completionDate', this.get('expectedCompletionDate'));
            }
            this.set('sort', mySort);
            this.validate();
            if (statusEnum === Status.validStatuses.progress) {
                setInterval(this.statusMessage, 1000);
            }

        },
        validate: function() {
            var id = this.get("id");
            if (!this.get('fullname')) {
                this.set('fullname', 'Missing Name');
                Backbone.trigger('dataError', 'Missing fullName id: ' + id);
            }
            if (!this.validEmail(this.get('email'))) {
                this.set('email', '');
                Backbone.trigger('dataError', 'Invalid email id: ' + id);
            }
            if ((this.get('processed')) && !this.get('start_date')) {
                Backbone.trigger('dataError', 'Processed with missing start date id: ' + id);
            }
            if (this.get('statusEnum') === Status.invalidStatus) {
                Backbone.trigger('dataError', 'Invalid status id: ' + id);
            }
        },
        validEmail: function(email) {
            //Validating an email is a VERY hard problem. The regex for email is crazy long.  This looks for the obvious problems
            var match = /^[a-zA-Z0-9@\.]*$/.exec(email);
            if (!match) {
                return false;
            }
            match = /.+@.+\.+./.exec(email);
            if (!match) {
                return false;
            }
            return true;
        },
        momentify: function(field) {
            if (!this.get(field)) {
                return;
            }
            var mTime = moment.utc(this.get(field), this.inTimeFormat);
            this.set(field, mTime);
            this.set(field + '_display', mTime.format(this.outTimeFormat));
        },
        bytes: function(field) {
            var normalized;
            var affix;
            var data = this.get(field);
            if (data > 1e12) {
                normalized = data / 1e12;
                affix = 'TB';
            } else if (data > 1e9) {
                normalized = data / 1e9;
                affix = 'GB';
            } else if (data > 1e6) {
                normalized = data / 1e6;
                affix = 'MB';
            } else if (data > 1e3) {
                normalized = data / 1e3;
                affix = 'kB';
            } else {
                normalized = data;
                affix = 'B';
            }
            var rounded = +normalized.toFixed(2);
            var result = rounded + ' ' + affix;
            this.set(field + 'Bytes', result);
        },
        statusMessage: function() {
            var oldStatus = this.get('statusMessage');
            var statusMessage = this.get('statusEnum').statusMessage(this);
            if (oldStatus !== statusMessage) {
                this.set('statusMessage', statusMessage);

            }
        }
    });
});
