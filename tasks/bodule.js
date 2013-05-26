/*
 * grunt-bodule
 * https://github.com/Bodule/grunt-bodule
 *
 * Copyright (c) 2013 island205
 * Licensed under the MIT license.
 */

'use strict';

var bodule = require('bodule');
var deepMerge = require('deepmerge');
var _ = require('underscore');
var path = require('path');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('bodule', 'Wrap you node module with broswer module', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: '\n'
        });
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            // Concat specified files.
            var src = f.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            }).map(function(filepath) {
                // Read file source.
                var boduleOptions = {
                    path: filepath
                };
                var boduleCode = '';
                var dest = f.dest + options.package.version + '/' + filepath;

                boduleOptions = deepMerge(_.clone(options), boduleOptions);

                boduleCode = bodule(path.normalize('/' + filepath), grunt.file.read(filepath), options.package);

                // Write every module for page business logic
                grunt.file.write(dest, boduleCode);
                grunt.log.writeln('File "' + dest + '" created.');

                return boduleCode;

            }).join(grunt.util.normalizelf(options.separator));

            // Write the destination file.
            var dest = f.dest + options.package.version + '/' + options.package.main;
            grunt.file.write(dest, src);

            // Print a success message.
            grunt.log.writeln('File "' + dest + '" created.');
        });
    });

};

