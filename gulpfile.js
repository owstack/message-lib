'use strict';
var gulp = require('gulp');
var owsTasks = require('@owstack/ows-build');
owsTasks('message', 'lib');
gulp.task('default', ['lint', 'coverage']);
