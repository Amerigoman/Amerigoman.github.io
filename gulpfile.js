var gulp = require('gulp');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var less = require('gulp-less');
var argv = require('yargs').argv;
var debug = require( 'gulp-debug' );
var clean = require( 'gulp-clean' );
var livereload = require('gulp-livereload');
var handlebars = require('gulp-handlebars');
var wrap = require( 'gulp-wrap' );
var declare = require( 'gulp-declare' );
var csscomb = require('gulp-csscomb');
var htmlhint = require('gulp-htmlhint');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var cssnano = require('gulp-cssnano');

var destDir = 'client_build';

gulp.task('default', ['build']);

gulp.task('build', function (cb) {
    runSequence(
        'css',
        'reload-page',
        cb 
    );
} );

gulp.task('css', function () {
    return gulp.src('css/**/*.less' )
        .pipe(concat('style.css'))
        .pipe(less())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
} );

gulp.task('reload-page', function () {
    return gulp.src('*')
        .pipe(livereload());
} );
   
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('**/*.{html|js|less}', ['build']); 
} );

//CODESTYLE
gulp.task('style', function () {
        runSequence('jshint', 'jscs', 'htmlhint', 'csscomb');
    }
);

gulp.task('htmlhint', function () {
    return gulp.src('client_src/**/*.html')
        .pipe(htmlhint('.htmlhintrc'))
        .on('error', handleError)
        .pipe(htmlhint.reporter());
});

gulp.task('jscs', function () {
    return gulp.src('client_src/**/*.js')
        .pipe(jscs({
            fix: true,
            configPath: '.jscs.json'
        }).on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('jshint', function () {
    return gulp.src('client_src/**/*.js')
        .pipe(jshint().on('error', handleError))
        .pipe(jshint.reporter('default'));
});

gulp.task('csscomb', function () {
    return gulp.src('client_src/**/*.less')
        .pipe(csscomb().on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});
//CODESTYLE//
function handleError(err) {
    console.log(err.toString());
    this.emit('end');
    return this;
}

