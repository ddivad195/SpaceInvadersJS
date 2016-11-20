'use strict';

var childProcess = require('child_process');
var electron = require('electron');
var gulp = require('gulp');

gulp.task('start', function () {
    childProcess.spawn(electron, ['./src'], {
        stdio: 'inherit'
    })
    .on('close', function () {
        process.exit();
    });
});
