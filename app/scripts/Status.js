define(['underscore', 'moment'], function(_, moment) {
    'use strict';

    return {
        validStatuses: {
            inactive: {
                match: function(item) {
                    return !item.get('start_date');
                },
                statusMessage: function() {
                    return 'not started';
                },
                css: 'paused',
                expectedCompletionDate: function() {
                    return null;
                },
                sort: 1
            },
            error: {
                match: function(item) {
                    return (item.get('start_date')) && (item.get('end_date')) && (item.get('total') !== item.get('processed'));
                },
                statusMessage: function(item) {
                    return 'Halted: ' + item.get('end_date_display');
                },
                css: 'fail',
                expectedCompletionDate: function() {
                    return null;
                },
                sort: 4
            },
            success: {
                match: function(item) {
                    return (item.get('start_date')) && (item.get('end_date')) && (item.get('total') === item.get('processed'));
                },
                statusMessage: function(item) {
                    return 'Completed: ' + item.get('end_date_display');
                },
                css: 'success',
                expectedCompletionDate: function() {
                    return null;
                },
                sort: 3
            },
            progress: {
                match: function(item) {
                    return (item.get('start_date')) && (!item.get('end_date')) && (item.get('total') !== item.get('processed'));
                },
                statusMessage: function(item) {
                    if (!item.get('expectedCompletionDate')) {
                        this.expectedCompletionDate(item);
                    }
                    var remaining = moment.duration(item.get('expectedCompletionDate').diff(moment()));

                    if (remaining.asSeconds() <= 0) {
                        return "Expected Completed";
                    }
                    var numOfDays = remaining.asDays();
                    if (numOfDays >= 2) {
                        return 'Time Remaining: ' + numOfDays.toFixed(0) + ' days';
                    }
                    var hours = remaining.asHours().toFixed(0);
                    var minutes = remaining.minutes();
                    var seconds = remaining.seconds();
                    return 'Time Remaining: ' + hours + ':' + minutes + ':' + seconds;
                },
                expectedCompletionDate: function(item) {
                    var result = item.get('initTime').add(item.get('remaining'));
                    item.set('expectedCompletionDate', result);
                },
                css: 'inProgress',
                sort: 2
            }
        },
        invalidStatus: {
            css: 'fail',
            statusMessage: function() {
                return "Unknown";
            },
            expectedCompletionDate: function() {
                return null;
            },
            sort: 5
        },
        lastSort: 5,
        findStatus: function(item) {
            var validStatus = _.find(this.validStatuses, function(status) {
                return status.match(item);
            });
            if (validStatus) {
                return validStatus;
            }
            return this.invalidStatus;
        }
    };
});
