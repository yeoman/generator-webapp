# Setting up Nunjucks

This recipe shows how to set up Nunjucks to compile your templates, including LiveReload integration.

We assume your directory structure will look something like this:

```
webapp
└── app
    ├── about.njk
    ├── contact.njk
    ├── index.njk
    ├── includes
    │   ├── footer.njk
    │   └── header.njk
    └── layouts
        └── default.njk
```

If you had something different in mind, modify paths accordingly.

## Steps

### 1. Install dependencies

Install [gulp-nunjucks-render](https://github.com/carlosl/gulp-nunjucks-render) to render Nunjucks template language to HTML:

```
$ npm install --save-dev gulp-nunjucks-render
```

### 2. Modify `app/index.html` to create as `app/layouts/default.njk` layouts template

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

```
$ mv app/index.html app/layouts/default.njk
```

### 3. Create new Nunjucks `app/index.njk` page to extend from `app/layouts/default.njk`

Create `app/index.njk`:

```diff
+{% extends "layouts/default.njk" %}
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
gulp.task('views', () => {
  return gulp.src('app/*.njk')
  .pipe($.nunjucksRender({
      path: 'app'
    }))
    .pipe(gulp.dest('.tmp'))
});
```

This compiles `app/*.njk` files into static `.html` files in the `.tmp` directory.

### 5. Add `views` as a dependency of both `html` and `serve`

```js
gulp.task('html', ['views', 'styles', 'scripts'], () => {
    ...
```

```js
gulp.task('serve', ['views', 'styles', 'fonts'], () => {
  ...
```

### 6. Configure `html` task to include files from `.tmp`

```diff
 gulp.task('html', ['styles', 'views', 'scripts'], () => {
-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.cssnano()))
     .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
     .pipe(gulp.dest('dist'));
 });
```

### 7. Update `extras`

We don't want to copy over `.njk` files in the build process:

```diff
 gulp.task('extras', () => {
   return gulp.src([
     'app/*.*',
-    '!app/*.html'
+    '!app/*.html',
+    '!app/*.njk'
   ], {
     dot: true
   }).pipe(gulp.dest('dist'));
 });
```

### 8. Configure `wiredep` task to wire Bower components on layout templates only

Wiredep does not support `.njk`, so also add in the file type definition.

```diff
  gulp.task('wiredep', () => {
    ...
-   gulp.src('app/*.html')
+   gulp.src('app/layouts/*.njk')
      .pipe(wiredep({
        exclude: ['bootstrap-sass'],
-       ignorePath: /^(\.\.\/)*\.\./
+       ignorePath: /^(\.\.\/)*\.\./,
+       fileTypes: {
+         njk: {
+           block: /(([ \t]*)<!--\s*bower:*(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbower\s*-->)/gi,
+           detect: {
+             js: /<script.*src=['"]([^'"]+)/gi,
+             css: /<link.*href=['"]([^'"]+)/gi
+           },
+           replace: {
+             js: '<script src="{{filePath}}"></script>',
+             css: '<link rel="stylesheet" href="{{filePath}}" />'
+           }
+         }
+       }
+     }))
-     .pipe(gulp.dest('app'));
+     .pipe(gulp.dest('app/layouts'));
  });
```


### 9. Edit your `serve` task

Edit your `serve` task to watch HTML files in `.tmp`, and so that (a) editing an `app/**/*.html` or `app/**/*.njk` file triggers the `views` task, and (b) reloads the browser:

```diff
  gulp.task('serve', ['views', 'styles', 'fonts'], () => {
    ...
    gulp.watch([
      'app/*.html',
+     '.tmp/*.html',
      '.tmp/styles/**/*.css',
      'app/scripts/**/*.js',
      'app/images/**/*'
    ]).on('change', reload);

+   gulp.watch('app/**/*.html', ['views']);
+   gulp.watch('app/**/*.njk', ['views']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
```

Notice we are still watching `.html` files in `app` because our templates have a different extension.
