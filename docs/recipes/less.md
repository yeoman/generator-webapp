# Setting up Less

This is an easy way to set up Less, including integration with `watch` and LiveReload.


## Steps

### 1. *Choose Sass* when running the generator

It sounds odd but this is the easiest way, because the task tree will be set up correctly for CSS preprocessing, and you can just switch out all the Sass references to Less ones.

But don't choose Bootstrap in the generator – it's easier to manually set up the Less version of Bootstrap afterwards, if you need it.

### 2. Switch your npm dependencies

Remove gulp-sass and install [gulp-less](https://github.com/plus3network/gulp-less) instead:

```
$ npm uninstall --save-dev gulp-sass && npm install --save-dev gulp-less
```

### 3. Edit a few tasks

```diff
 gulp.task('styles', () => {
-  return gulp.src('app/styles/*.scss')
+  return gulp.src('app/styles/*.less')
     .pipe($.plumber())
     .pipe($.sourcemaps.init())
-    .pipe($.sass.sync({
-      outputStyle: 'expanded',
-      precision: 10,
-      includePaths: ['.']
-    }).on('error', $.sass.logError))
+    .pipe($.less({
+      paths: ['.']
+    }))
     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
     .pipe($.sourcemaps.write())
     .pipe(gulp.dest('.tmp/styles'))
     .pipe(reload({stream: true}));
});
```

```diff
gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
   ...
-  gulp.watch('app/styles/**/*.scss', ['styles']);
+  gulp.watch('app/styles/**/*.less', ['styles']);
   ...
```

```diff
 gulp.task('wiredep', () => {
-  gulp.src('app/styles/*.scss')
+  gulp.src('app/styles/*.less')
     ...
 });
```

### 4. Check that it's working

Delete `app/styles/main.scss` and replace it with your own `main.less`.

Then verify that `gulp build` and `gulp serve` work correctly. While `gulp serve` is running you should be able to edit your `main.less` and see the styles dynamically update in your browser.


## Extras

### Add Bootstrap

Install it as a bower component:

```
$ bower install --save bootstrap
```

Now you have two options for including Bootstrap in your page:

- **Option 1**: Run `gulp wiredep`
  - This automatically inserts `<link>` and `<script>` tags for Bootstrap in your `index.html`

- **Option 2**: Include the parts you want manually

  - Exclude Bootstrap's compiled assets in the `wiredep` task:

  ```diff
   gulp.task('wiredep', () => {
     ...
     gulp.src('app/*.html')
       .pipe(wiredep({
  +      exclude: ['bootstrap/dist'],
         ignorePath: /^(\.\.\/)*\.\./
       }))
       .pipe(gulp.dest('app'));
   });
  ```
  - In your `main.less`, add `@import "bower_components/bootstrap/less/bootstrap.less";` – or you could do [something more granular](http://www.helloerik.com/bootstrap-3-less-workflow-tutorial)
  - In your `index.html`, add script tags for the individual components you want, e.g. `<script src="/bower_components/bootstrap/js/affix.js"></script>`
    - NB: Some modules depend on others, e.g. `popover.js` depends on `tooltip.js` – see the [docs](http://getbootstrap.com/javascript/)
