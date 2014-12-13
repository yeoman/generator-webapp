# Setting up Less

This is an easy way to set up Less, including integration with `watch` and LiveReload.


## Steps

### 1. *Choose Sass* when running the generator

It sounds odd but this is the easiest way, because the task tree will be set up correctly for CSS preprocessing, and you can just switch out all the Sass references to Less ones.

> But don't choose Bootstrap in the generator – it's easier to manually set up the Less version of Bootstrap afterwards, if you need it.

### 2. Switch your npm dependencies

Remove gulp-ruby-sass and install [gulp-less](https://github.com/plus3network/gulp-less) instead:

```sh
$ npm uninstall --save-dev gulp-ruby-sass && npm install --save-dev gulp-less
```

### 3. Edit a few tasks

```diff
 gulp.task('styles', function () {
-  return gulp.src('app/styles/main.scss')
+  return gulp.src('app/styles/main.less')
-    .pipe($.rubySass({
-      style: 'expanded',
-      precision: 10,
-      loadPath: ['.']
-    }))
-    .on('error', function (err) { console.log(err.message); })
+    .pipe($.less({
       paths: ['.']
     }))
     .pipe($.postcss([
       require('autoprefixer-core')({browsers: ['last 1 version']})
     ]))
     .pipe(gulp.dest('.tmp/styles'));
 });
```

```diff
 gulp.task('wiredep', function () {
   var wiredep = require('wiredep').stream;

-  gulp.src('app/styles/*.scss')
+  gulp.src('app/styles/*.less')
     ...
 });
```

```diff
 gulp.task('watch', ['connect'], function () {
   ...
-  gulp.watch('app/styles/**/*.scss', ['styles']);
+  gulp.watch('app/styles/**/*.less', ['styles']);
   gulp.watch('bower.json', ['wiredep', 'fonts']);
 });
```

### 4. Check it's working

Delete `app/styles/main.scss` and replace it with your own `main.less`.

Then verify that `gulp build` and `gulp serve` work correctly. In `watch` mode, you should be able to edit your `main.less` and see the styles dynamically update in your browser.


## Extras

### Add Bootstrap

Install it as a bower component:

```sh
$ bower install --save bootstrap
```

Now you have two options for including Bootstrap in your page:

- **Option 1**: Run `gulp wiredep`
  - This automatically inserts `<link>` and `<script>` tags for Bootstrap in your `index.html`

- **Option 2**: Include the parts you want manually

  - Exclude Bootstrap's compiled assets in the `wiredep` task:

  ```diff
   gulp.task('wiredep', function () {
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


### Add Less Source Maps

Install [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps):

```sh
$ npm install --save-dev gulp-sourcemaps
```

Edit your `less` task to match the following:

```diff
 gulp.task('styles', function () {
   return gulp.src('app/styles/main.less')
+    .pipe($.sourcemaps.init())
     .pipe($.less({
       paths: ['.']
     }))
     .pipe($.postcss([
       require('autoprefixer-core')({browsers: ['last 1 version']})
     ]))
+    .pipe($.sourcemaps.write('.'))
     .pipe(gulp.dest('.tmp/styles'));
 });
```

Note that in this example it's specified that an external sourcemap should get written to the same directory as the CSS output. The default is to write the sourcemap inline:

```diff
- .pipe($.sourcemaps.write('.'))
+ .pipe($.sourcemaps.write())
```
