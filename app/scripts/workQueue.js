define(['lodash'], function(_) {
    'use strict';
    var base = {
        chunk: function(arr, chunkSize) {
            var result = [];
            for (var i = 0; i < arr.length; i += chunkSize){
                result.push(arr.slice(i, i + chunkSize));
            }
            return result;
        },
        worker: function(chunks, func) {
            if (chunks.length === 0) {
                return chunks;
            }
            var chunk = chunks[0];
            _.each(chunk, func);
            return _.rest(chunks);
        },
        makeInterval: function(intervalTime, chunks, func) {
            var worker = this.worker;
            var interval = setInterval(function() {
                chunks = worker(chunks, func);
                if (chunks.length === 0) {
                    clearInterval(interval);
                }
            }, intervalTime);
            return interval;
        },
        helper: function(arr, chunkSize, intervalTime, func) {
            var chunks = this.chunk(arr, chunkSize);
            return this.makeInterval(intervalTime, chunks, func);
        }
    };

    var returnFunction = function returnFunction(arr, chunkSize, intervalTime, func) {
        return returnFunction.helper(arr, chunkSize, intervalTime, func);
    };

    returnFunction = _.extend(returnFunction, base);
    _.bindAll(returnFunction, 'chunk', 'worker', 'makeInterval', 'helper');
    return returnFunction;
});
