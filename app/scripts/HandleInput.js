define(['backbone', 'lodash', 'jquery'], function(Backbone, _, $) {
    'use strict';
    var func = function(collection) {
        function handleFileSelect(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            var files = evt.dataTransfer.files;

            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0; i < files.length; i++) {
                Backbone.trigger('modal:load');
                var f = files[i];
                output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                    f.size, ' bytes, last modified: ',
                    f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                    '</li>');
                var reader = new FileReader();
                reader.addEventListener("load", function(event) {
                    var name = f.name || 'Unknown file';
                    collection.readFile(name, event);
                });
                reader.readAsText(f);
                $('#list').append('<ul>' + output.join('') + '</ul>');

            }
        }

        function handleDragOver(evt) {
                evt.stopPropagation();
                evt.preventDefault();
                evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
            }
            //document.getElementById('files').addEventListener('change', handleFileSelect, false);
        var dropZone = document.getElementById('drop_zone');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);
    };

    return func;

});
