var gulp = require('gulp');
var ts = require('gulp-typescript');
var closureCompiler = require('google-closure-compiler').gulp();

gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'output.js'
        }))
        .pipe(closureCompiler({
            compilation_level: 'SIMPLE',
            warning_level: 'VERBOSE',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ECMASCRIPT5_STRICT',
            js_output_file: 'monthpicker.min.js'
        }))
        .pipe(gulp.dest('.'));
});
