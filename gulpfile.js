var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var browserify  = require('gulp-browserify');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');

// Update html
gulp.task('html', function() {
    return gulp.src("app/*.html")
        .pipe(gulp.dest("dist/"));
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("dist/css"));
});

// process JS files and return the stream.
gulp.task('js', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(browserify())
        .pipe(gulp.dest('dist/js'));
});

// Copy local json data
gulp.task('data', function() {
    return gulp.src("app/data/*.json")
        .pipe(gulp.dest("dist/data"));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('html-watch', ['html'], function (done) {
    browserSync.reload();
    done();
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve',['html','sass','js','data'], function () {

    // Serve files from the root of this project
    browserSync.init({
        server: "./dist"
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch("app/js/**/*.js", ['js-watch']);
    gulp.watch("app/scss/*.scss", ['sass-watch']);
    gulp.watch("app/*.html",['html-watch']);
});

gulp.task('default', ['serve']);
