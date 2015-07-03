 define(['lodash', 'jquery', 'hjson'], function(_) {
     //We need to decompose this for testing.
     //It is hard to write tests that require a specific thing in url
     "use strict";
     var base = {
         helper: function(url) {
             var useHjson = (url.indexOf('nocheats') === -1);
             if (!useHjson) {
                 return;
             }
             var oParse = JSON.parse;
             var parse = function(string) {
                 try {
                     return oParse(string);
                 } catch (error) {
                     return Hjson.parse(string);
                 }
             };
             JSON.parse = parse;
         }
     };
     var resultFunction = function resultFunction() {
         resultFunction.helper(window.location.href);
     };
     _.extend(resultFunction, base);
     return resultFunction;
 });
