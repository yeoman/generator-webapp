# Setting up Nunjucks

This recipe shows how to set up Nunjucks to compile your templates, including LiveReload integration.


## Steps

### 1. Install dependencies

Install some gulp plugins:

```sh
$ npm install --save-dev gulp-nunjucks-render
```

> * [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render) Render Nunjucks template language to html


> * You need this so you can include the Handlebars runtime in your page – even compiled templates depend on this. (You won't need to include the entire Handlebars library though.)
> * It's a good idea to verify you've installed the same version of Handlebars as the one used by internally by gulp-handlebars, to guarantee compatibility between the runtime and your compiled templates. Look in `node_modules/gulp-handlebars/package.json` under `"dependencies"` and check the handlebars version – if necessary, you can ask bower to install that specific version, e.g. `bower install --save handlebars#^1.3.0`.

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
    .pipe(gulp.dest('app'))
});
```

> This compiles `app/templates/.html` files into static `.html` files in the `app` root directory.

### 6. Add `templates` as a dependency of both `html` and `serve`

```js
gulp.task('serve', ['connect', 'styles', 'templates'], function () {
    ...
```

```js
gulp.task('html', ['styles', 'templates'], function () {
    ...
```

### 7. Configure `wiredep` task to wire bower components on layout templates only

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


### 8. Configure watch

Edit your `watch` task so that (a) editing an `templates/**/*.html` file triggers the `templates` task, and (b) the LiveReload server:

```diff
    gulp.task('watch', ['connect', 'serve'], function () {
      $.livereload.listen();

      // watch for changes
      gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
      ]).on('change', $.livereload.changed);

+     gulp.watch('app/templates/**/*.html', ['templates']);
      gulp.watch('app/styles/**/*.scss', ['styles']);
      gulp.watch('bower.json', ['wiredep']);
    });
```
