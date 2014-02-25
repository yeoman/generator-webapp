'use strict';
// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp = require('gulp');

// Load plugins
var $ = require('gulp-load-plugins')();

<% if (includeSass) { %>
// Styles
gulp.task('styles', function () {
    return gulp.src('app/styles/main.scss')
        .pipe($.rubySass({
          style: 'expanded',
          loadPath: ['app/bower_components']
        }))
        .pipe($.autoprefixer('last 1 version'))
        .pipe(gulp.dest('app/styles'))
        .pipe($.size());
});
<% } %>
// Scripts
gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('default'))
        .pipe($.size());
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
      .pipe($.useref())
      .pipe(gulp.dest('dist'))
      .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

// Clean
gulp.task('clean', function () {
    return gulp.src([<% if (includeSass) { %>'dist/styles', <% } %>'dist/scripts', 'dist/images'], {read: false}).pipe($.clean());
});

// Bundle
gulp.task('bundle', [<% if (includeSass) { %>'styles', <% } %>'scripts'], $.bundle('./app/*.html'));

// Build
gulp.task('build', ['html', 'bundle', 'images']);

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Connect
gulp.task('connect', $.connect.server({
    root: ['app'],
    port: 9000,
    livereload: true
}));

// Watch
gulp.task('watch', ['connect'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        <% if (includeSass) { %>'app/styles/**/*.css',<% } %>
        'app/scripts/**/*.js',
        'app/images/**/*'
    ], function(event) {
        return gulp.src(event.path)
            .pipe($.connect.reload());
    });
    <% if (includeSass) { %>
    // Watch .scss files
    gulp.watch('app/styles/**/*.scss', ['styles']);
    <% } %>

    // Watch .js files
    gulp.watch('app/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});
