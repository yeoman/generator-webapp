# Setting up Nunjucks

This recipe shows how to set up Nunjucks to compile your templates, including LiveReload integration.

We assume your directory structure will look something like this:

```
webapp
└── app
    ├── about.html
    ├── contact.html
    ├── index.html
    ├── includes
    │   ├── footer.html
    │   └── header.html
    └── layouts
        └── default.html
```

If you had something different in mind, modify paths accordingly.

## Steps

### 1. Install dependencies

Install [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render) to render Nunjucks template language to HTML:

```sh
$ npm install --save-dev gulp-nunjucks-render
```

### 2. Modify `app/index.html` to create as `app/layouts/default.html` layouts template

Modify `app/index.html`:

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

Make it the default layout template:

```sh
$ mv app/index.html app/layouts/default.html
```

### 3. Create new Nunjucks `app/index.html` page to extend from `app/layouts/default.html`

Create `app/index.html`:

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

### 4. Create a `views` task

```js
gulp.task('views', function () {
  $.nunjucksRender.nunjucks.configure(['app/']);

  return gulp.src('app/*.html')
    .pipe($.nunjucksRender())
    .pipe(gulp.dest('.tmp'))
});
```

This compiles `app/*.html` files into static `.html` files in the `.tmp` directory.

### 5. Add `views` as a dependency of both `html` and `serve`

```js
gulp.task('html', ['views', 'styles'], function () {
    ...
```

```js
gulp.task('serve', ['views', 'styles', 'fonts'], function () {
  ...
```

### 6. Configure `html` task to include files from `.tmp`

```diff
 gulp.task('html', ['styles', 'views'], function () {
   var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe(assets)
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.minifyCss({compatibility: 'ie8'})))
     .pipe(assets.restore())
     .pipe($.useref())
     .pipe(gulp.dest('dist'));
 });
```

### 7. Configure `wiredep` task to wire Bower components on layout templates only

```diff
  gulp.task('wiredep', function () {
    ...
-   gulp.src('app/*.html')
+   gulp.src('app/layouts/*.html')
      .pipe(wiredep({
        exclude: ['bootstrap-sass'],
        ignorePath: /^(\.\.\/)*\.\./
      }))
-     .pipe(gulp.dest('app'));
+     .pipe(gulp.dest('app/layouts'));
  });
```


### 8. Edit your `serve` task

Edit your `serve` task so that (a) editing an `app/**/*.html` file triggers the `views` task, and (b) reloads the browser:

```diff
  gulp.task('serve', ['views', 'styles', 'fonts'], function () {
    ...
    gulp.watch([
-     'app/*.html',
+     '.tmp/*.html',
      '.tmp/styles/**/*.css',
      'app/scripts/**/*.js',
      'app/images/**/*'
    ]).on('change', reload);

+   gulp.watch('app/**/*.html', ['views', reload]);
    gulp.watch('app/styles/**/*.scss', ['styles', reload]);
    gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
  });
```

Notice that we don't watch `.html` files in `app` anymore (unlike in the [Jade](docs/recipes/jade.md) recipe). This is because our templates and compiled files have the same extension, so we want to make sure to refresh the browser once the templates have been compiled.
