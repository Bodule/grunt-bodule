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
var npm = require('npm');
var semver = require('semver');
var async = require('async');
var noloader = require('noloader');

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks
    grunt.registerMultiTask('bodule', 'Wrap you node module with broswer module', function() {

        var that = this;

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            separator: '\n'
        });

        var dependencies = Object.keys(options.pkg.dependencies || {}).map(function (dep) {
            return [dep, options.pkg.dependencies[dep]]
        })

        var done = this.async()
        
        npm.load({}, function () {

            async.map(dependencies, function (dep, callback) {
                var v = semver.valid(dep[1])
                if (v) {
                    callback(null, [dep[0], v])
                } else if(semver.validRange(dep[1])) {
                    npm.registry.get(dep[0], 600, function(err, data) {
                        var versions = Object.keys(data.versions || {})
                        v = semver.maxSatisfying(versions, dep[1])
                        callback(null, [dep[0], v])
                    })
                } else {
                    callback(null, [dep[0], v])
                }
            }, function (err, results) {
                results.forEach(function(dep) {
                    options.pkg.dependencies[dep[0]] = dep[1]
                })
                getRealVersionsCallback.call(that)
            })
        })

        function getRealVersionsCallback() {
            
            // Iterate over all specified file groups.
            this.files.forEach(function(f) {
                var files = noloader.analyse(options.pkg.main).values().map(function (file) {
                  return path.relative(process.cwd(), file.id)
                })
                // Concat specified files.
                // var src = f.src.filter(function(filepath) {
                var src= files.filter(function(filepath) {
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
                    var dest = f.dest + options.pkg.version + '/' + filepath;

                    boduleOptions = deepMerge(_.clone(options), boduleOptions);

                    boduleCode = bodule(path.normalize('/' + filepath), grunt.file.read(filepath), options.pkg);

                    // Write every module for page business logic
                    grunt.file.write(dest, boduleCode);
                    grunt.log.writeln('Module File "' + dest + '" created.');

                    return boduleCode;

                }).join(grunt.util.normalizelf(options.separator));

                // Write the destination file.
                var destN = f.dest + options.pkg.version + '/' + options.pkg.name + '.js';
                var destM = f.dest + options.pkg.version + '/' + options.pkg.main;

                grunt.log.writeln(destN)
                grunt.log.writeln(destM)


                if (destN == destM) {
                    grunt.file.write(destN, src);
                } else {
                    grunt.file.write(destN, src + ';\n' +
                        'define(\'' + options.pkg.name + '@' + options.pkg.version + '/' + options.pkg.name+ '\', [\'' + options.pkg.name + '@' + options.pkg.version + '/' + options.pkg.main+ '\'], function (require, exports, module) {' + 
                            'module.exports = require(\'' + options.pkg.name + '@' + options.pkg.version + '/' + options.pkg.main+ '\');' + 
                        '})'
                    );
                }
                // Print a success message.
                grunt.log.writeln('Package File "' + destN + '" created.');
            });
            
            done()
            // Hack on async task
            grunt.asyncCallback && grunt.asyncCallback()
        }
        
    });

};

