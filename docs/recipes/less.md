# Setting up Less

This is an easy way to set up Less, including integration with `watch` and LiveReload.


## Steps

### 1. Choose Sass when running the generator!

This is the easiest way, because the task tree will be set up correctly for CSS preprocessing, and you can just switch out all the Sass references to Less ones.

> Don't choose Bootstrap in the generator – it's easier to manually set up the Less version of Bootstrap afterwards, if you need it.

### 2. Switch your NPM dependencies

Remove gulp-ruby-sass and install [gulp-less](https://github.com/plus3network/gulp-less) instead:

```sh
$ npm uninstall --save-dev gulp-ruby-sass && npm install --save-dev gulp-less
```

### 3. Edit a few tasks

```diff
 gulp.task('styles', function () {
-     return gulp.src('app/styles/main.scss')
+     return gulp.src('app/styles/main.less')
-        .pipe($.rubySass({
-            style: 'expanded',
-            precision: 10
-        }))
+        .pipe($.less())
         .pipe($.autoprefixer('last 1 version'))
         .pipe(gulp.dest('.tmp/styles'));
 });
```

```diff
 gulp.task('wiredep', function () {
     var wiredep = require('wiredep').stream;
 
-    gulp.src('app/styles/*.scss')
+    gulp.src('app/styles/*.less')
         .pipe(wiredep({
             directory: 'app/bower_components'
         }))
         .pipe(gulp.dest('app/styles'));
 
     gulp.src('app/*.html')
         .pipe(wiredep({
             directory: 'app/bower_components'
         }))
         .pipe(gulp.dest('app'));
 });
```

```diff
 gulp.task('watch', ['serve', 'styles', 'templates'], function () {
     var server = $.livereload();
 
     // watch for changes
 
     gulp.watch([
         'app/*.html',
         '.tmp/styles/**/*.css',
         '.tmp/templates/**/*.js',
         'app/scripts/**/*.js',
         'app/images/**/*'
     ]).on('change', function (file) {
         server.changed(file.path);
     });
 
-    gulp.watch('app/styles/**/*.scss', ['styles']);
+    gulp.watch('app/styles/**/*.less', ['styles']);
     gulp.watch('app/templates/**/*.hbs', ['templates']);
     gulp.watch('app/images/**/*', ['images']);
     gulp.watch('bower.json', ['wiredep']);
 });
```


### 4. Check it's working

Delete `app/styles/main.scss` and replace it with your own `main.less`.

Then verify that `$ gulp build` and `$ gulp watch` work correctly. In `watch` mode, you should be able to edit your `main.less` and see the styles dynamically update in your browser.


---

## Extras

### Add Bootstrap

Install it as a bower component:

```sh
$ bower install --save bootstrap
```

Now you have two options for including Bootstrap in your page:

- **Option 1**: Run `$ gulp wiredep`
  - This automatically inserts the complete Bootstrap stylesheet and script into your `index.html`

- **Option 2**: Include the parts you want manually
  - For example, in your `main.less`, add `@import "../bower_components/bootstrap/less/bootstrap.less";` – or you could do something more granular
  - In your `index.html`, add script tags for the individual components you want, e.g. `<script src="bower_components/bootstrap/js/affix.js"></script>`
    - NB: Some modules depend on others, e.g. `popover.js` depends on `tooltip.js` – see [docs](http://getbootstrap.com/javascript/)
