# Asset revisioning

This recipe demonstrates how to set up simple static asset revisioning (aka *revving*) for CSS and JS by appending content hash to their filenames `unicorn.css` → `unicorn-098f6bcd.css`.

Make sure to set the files to [never expire](http://developer.yahoo.com/performance/rules.html#expires) for this to have an effect.

## Steps

### 1. Install dependencies

Install these gulp plugins:

```
$ npm install --save-dev gulp-rev gulp-rev-rewrite
```

* [gulp-rev](https://github.com/sindresorhus/gulp-rev) appends content hashes
* [gulp-rev-rewrite](https://github.com/TheDancingCode/gulp-rev-rewrite) updates references to those files

### 2. Update the `html` task

Instead of wasting performance reading CSS and JS files into a new stream, we can notice that we already have that stream available in the `html` task, so we can just perform revving there:

```diff
function html() {
  return src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
+   .pipe($.if(/\.js$/, $.rev()))
+   .pipe($.if(/\.css$/, $.rev()))
+   .pipe($.revRewrite())
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(dest('dist'));
}
```

* `.pipe($.if('*.js', $.rev()))` – at this point we have JS files in the stream, so we are revving them
* `.pipe($.if('*.css', $.rev()))` – at this point we have CSS files in the stream, so we are revving them
* `.pipe($.revReplace())` – at this point we have CSS, JS and HTML files in the stream, so we are updating all references to revved files
