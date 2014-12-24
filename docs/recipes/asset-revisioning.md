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
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
+   .pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
+   .pipe($.revReplace())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});
```

* `.pipe($.rev())` – at this point we have CSS and JS files in the stream, so we are revving them
* `.pipe($.revReplace())` – at this point we have CSS, JS and HTML files in the stream, so we are updating all references to revved files
