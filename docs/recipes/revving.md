# Asset revisioning

This recipe demonstrates how to set up simple static asset revisioning (aka *revving*) for CSS and JS by appending content hash to their filenames `unicorn.css` → `unicorn-098f6bcd.css`.

Make sure to set the files to [never expire](http://developer.yahoo.com/performance/rules.html#expires) for this to have an effect.

## Steps

### 1. Install dependencies

Install these gulp plugins:

```
$ npm install --save-dev gulp-rev gulp-rev-replace
```

* [gulp-rev](https://github.com/sindresorhus/gulp-rev) appends content hashes
* [gulp-rev-replace](https://github.com/jamesknelson/gulp-rev-replace) updates references to those files

### 2. Update the `html` task

Instead of wasting performance reading CSS and JS files into a new stream, we can notice that we already have that stream available in the `html` task, so we can just perform revving there:

```diff
gulp.task('html', ['styles'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

    return gulp.src('app/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
+       .pipe($.rev())
        .pipe($.useref.restore())
        .pipe($.useref())
+       .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});
```

* `.pipe($.rev())` – at this point we have CSS and JS files in the stream, so we are revving them
* `.pipe($.revReplace())` – at this point we have CSS, JS and HTML files in the stream, so we are updating all references to revved files
