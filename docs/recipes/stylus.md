# Setting up Stylus

This recipe shows how to set up compiling your stylesheets using [Stylus](http://stylus-lang.com/).

## Steps

### 1. Choose Sass when scaffolding

When scaffolding your app with `yo webapp`, choose Sass. This will make it easier for us to implement Stylus using the existing infrastructure. However, do not choose Bootstrap, we will add a Stylus port of Bootstrap later.

### 2. Convert `main.scss` into `main.styl`

We should first convert `main.scss` to Stylus. One way to do this is to convert it from Sass to CSS, then from CSS to Stylus, so let's do that. To convert to `.css`, simply run our `styles` task:

```
$ gulp styles
```

Now you have `.tmp/styles/main.css`. To convert that to `.styl`, we need the [Stylus executable](http://stylus-lang.com/docs/executable.html):

```
$ npm install --global stylus
$ stylus --css .tmp/styles/main.css app/styles/main.styl
```

Finally, add wiredep comments for injecting dependencies at the top:

```styl
// bower:styl
// endbower
```

Now that the conversion is complete, we can safely delete `app/styles/main.scss`.

### 3. Switch dependencies

After setting up Stylus we'll no longer need Sass, so we can uninstall gulp-sass and install gulp-stylus:

```
$ npm uninstall --save-dev gulp-sass
$ npm install --save-dev gulp-stylus
```

### 4. Edit the `styles` task

Unlike with Sass, Stylus doesn't ignore filenames starting with `_`, so we'll limit `gulp.src` only to `main.styl`:

```diff
 gulp.task('styles', () => {
-  return gulp.src('app/styles/*.scss')
+  return gulp.src('app/styles/main.styl')
     .pipe($.plumber())
     .pipe($.sourcemaps.init())
-    .pipe($.sass.sync({
-      outputStyle: 'expanded',
-      precision: 10,
-      includePaths: ['.']
-    }).on('error', $.sass.logError))
+    .pipe($.stylus({
+      paths: ['.']
+    }))
     .pipe($.sourcemaps.init())
     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
     .pipe($.sourcemaps.write())
     .pipe(gulp.dest('.tmp/styles'))
     .pipe(reload({stream: true}));
 });
```

### 5. Edit `serve` and `wiredep` tasks

To watch `.styl` files and recompile on change, modify the following line in the `serve` task:

```diff
 gulp.task('serve', () => {
   runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
     ...

-    gulp.watch('app/styles/**/*.scss', ['styles']);
+    gulp.watch('app/styles/**/*.styl', ['styles']);
     gulp.watch('app/scripts/**/*.js', ['scripts']);
     gulp.watch('app/fonts/**/*', ['fonts']);
     gulp.watch('bower.json', ['wiredep', 'fonts']);
   });
 });
```

Next, we need to modify the `wiredep` task to inject dependencies into `main.styl`:

```diff
 gulp.task('wiredep', () => {
-  gulp.src('app/styles/*.scss')
+  gulp.src('app/styles/*.styl')
    ...
 });
```

### 6. Install regular Bootstrap

There is a Styles port of Bootstrap, so let's install that one:

```
bower install --save bootstrap-stylus
```

However, some its [`main` field](https://github.com/maxmx/bootstrap-stylus/blob/master/bower.json#L4) is incomplete (JS files and fonts are missing), so we'll have to override it in our `bower.json`. We'll have to list every JS because the order matters (e.g. Popovers depend on Tooltips). Also, to ensure that jQuery is included before Bootstrap, we'll set it as a dependency:

```json
{
  "name": "webapp",
  "private": true,
  "dependencies": {
    "jquery": "~2.1.1",
    "modernizr": "~2.8.1",
    "bootstrap-stylus": "^5.0.7"
  },
  "overrides": {
    "bootstrap-stylus": {
      "main": [
        "bootstrap/index.styl",
        "js/transition.js",
        "js/alert.js",
        "js/button.js",
        "js/carousel.js",
        "js/collapse.js",
        "js/dropdown.js",
        "js/modal.js",
        "js/tab.js",
        "js/affix.js",
        "js/scrollspy.js",
        "js/tooltip.js",
        "js/popover.js",
        "fonts/*"
      ],
      "dependencies": {
        "jquery": "1.9.1 - 3"
      }
    }
  }
}
```

This weirdly specific version range for jQuery is taken from [Bootstrap's bower.json](https://github.com/twbs/bootstrap/blob/v3.3.7/bower.json#L32) and translates to `>=1.9.1 <=3` (read more about the [advanced range syntax](https://github.com/npm/node-semver#advanced-range-syntax)).

[`bootstrap/index.styl`](https://github.com/maxmx/bootstrap-stylus/blob/master/bootstrap/index.styl) imports stylesheets from `bower_components/bootstrap-stylus`, so we should add that path to our Stylus configuration:

```js
// ...
.pipe($.stylus({
  paths: ['.', './bower_components/bootstrap-stylus']
}))
// ...
```

To check if everything is wired up correctly, run `gulp wiredep`. In `index.html` you should see something like:

```html
<!-- build:js scripts/vendor.js -->
<!-- bower:js -->
<script src="/bower_components/modernizr/modernizr.js"></script>
<script src="/bower_components/jquery/dist/jquery.js"></script>
<script src="/bower_components/bootstrap-stylus/js/transition.js"></script>
<script src="/bower_components/bootstrap-stylus/js/alert.js"></script>
<script src="/bower_components/bootstrap-stylus/js/button.js"></script>
<script src="/bower_components/bootstrap-stylus/js/carousel.js"></script>
<script src="/bower_components/bootstrap-stylus/js/collapse.js"></script>
<script src="/bower_components/bootstrap-stylus/js/dropdown.js"></script>
<script src="/bower_components/bootstrap-stylus/js/modal.js"></script>
<script src="/bower_components/bootstrap-stylus/js/tab.js"></script>
<script src="/bower_components/bootstrap-stylus/js/affix.js"></script>
<script src="/bower_components/bootstrap-stylus/js/scrollspy.js"></script>
<script src="/bower_components/bootstrap-stylus/js/tooltip.js"></script>
<script src="/bower_components/bootstrap-stylus/js/popover.js"></script>
<!-- endbower -->
<!-- endbuild -->
```

and in `main.styl` you should see the following:

```styl
// bower:styl
@import "bower_components/bootstrap-stylus/bootstrap/index.styl"
// endbower
```

## Usage

Add `.styl` files to `app/styles` and use `@import` or `@require` to include them.
