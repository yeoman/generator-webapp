# Setting up Nunjucks

This recipe shows how to set up Nunjucks to compile your templates, including LiveReload integration.


## Steps

### 1. Install dependencies

Install [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render) to render Nunjucks template language to HTML

```sh
$ npm install --save-dev gulp-nunjucks-render
```

### 2. Setup directory structure

Create a ``app/templates/layouts`` directory structure

```sh
$ mkdir -p app/templates/layouts
```

### 3. Modify `app/index.html` to create as `app/templates/layouts/default.html` layouts template

Modify ``app/index.html``

```diff
-    <div class="hero-unit">
-      <h1>'Allo, 'Allo!</h1>
-      <p>You now have</p>
-      <ul>
-        <li>HTML5 Boilerplate</li>
-        <li>Sass</li>
-        <li>Modernizr</li>
-      </ul>
-    </div>
+    {% block content %}{% endblock %}
```

Move and rename template ``app/templates/layouts/default.html``

```sh
$ mv app/index.html app/templates/layouts/default.html
```

### 4. Create new Nunjucks `app/templates/index.html` page to extend from `app/templates/layouts/default.html`

New `app/templates/index.html`

```diff
+{% extends "layouts/default.html" %}
+
+{% block content %}
+  <div class="hero-unit">
+    <h1>'Allo, 'Allo!</h1>
+    <p>You now have</p>
+    <ul>
+      <li>HTML5 Boilerplate</li>
+      <li>Sass</li>
+      <li>Modernizr</li>
+    </ul>
+  </div>
+{% endblock %}
+
```

### 5. Create a `templates` task

```js
gulp.task('templates', function () {
  $.nunjucksRender.nunjucks.configure(['app/templates/']);

  return gulp.src(['app/templates/**/*.html', '!app/templates/layouts/*.html'])
    .pipe($.nunjucksRender())
    .pipe(gulp.dest('.tmp'))
});
```

> This compiles `app/templates/.html` files into static `.html` files in the `.tmp` directory.

### 6. Add `templates` as a dependency of both `html` and `connect`

```js
gulp.task('connect', ['styles', 'templates'], function () {
    ...
```

```js
gulp.task('html', ['styles', 'templates'], function () {
    ...
```

### 7. Configure `html` task to include files from `.tmp`

```diff
 gulp.task('html', ['styles', 'templates'], function () {
   var assets = $.useref.assets({searchPath: '{.tmp,app}'});

-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe(assets)
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.csso()))
     .pipe(assets.restore())
     .pipe($.useref())
     .pipe(gulp.dest('dist'));
 });
```

### 8. Configure `wiredep` task to wire bower components on layout templates only

```diff
    gulp.task('wiredep', function () {
      var wiredep = require('wiredep').stream;

      gulp.src('app/styles/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('app/styles'));

-     gulp.src('app/*.html')
+     gulp.src('app/templates/layouts/*.html')
        .pipe(wiredep())
-       .pipe(gulp.dest('app'));
+       .pipe(gulp.dest('app/templates/layouts'));
    });
```


### 9. Configure watch

Edit your `watch` task so that (a) editing an `templates/**/*.html` file triggers the `templates` task, and (b) the LiveReload server:

```diff
    gulp.task('watch', ['connect', 'serve'], function () {
      $.livereload.listen();

      // watch for changes
      gulp.watch([
        'app/*.html',
+       '.tmp/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
      ]).on('change', $.livereload.changed);

+     gulp.watch('app/templates/**/*.html', ['templates']);
      gulp.watch('app/styles/**/*.scss', ['styles']);
      gulp.watch('bower.json', ['wiredep']);
    });
```
