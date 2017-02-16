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

In `app/index.html` replace `<div class="container">` and its content (cut, so you can paste later) with the following:

```njk
{% block content %}{% endblock %}
```

Now make it the default layout template:

```
$ mv app/index.html app/layouts/default.njk
```

### 3. Create new Nunjucks `app/index.njk` page to extend from `app/layouts/default.njk`

Create `app/index.njk`, where you can paste the `<div class="container">` part from `app/index.html`:

```njk
{% extends "layouts/default.njk" %}

{% block content %}
  <div class="container">
    <!-- ... -->
  </div>
{% endblock %}
```

### 4. Create a `views` task

```js
gulp.task('views', () => {
  return gulp.src('app/*.njk')
    .pipe($.nunjucksRender({
      path: 'app'
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});
```

This compiles `app/*.njk` files into static `.html` files in the `.tmp` directory.

### 5. Create a 'views:reload' task

```js
gulp.task('views:reload', ['views'], () => {
  reload();
});
```

This triggers Browsersync after `views` task is completed

### 6. Add `views` as a dependency of both `html` and `serve`

```js
gulp.task('html', ['views', 'styles', 'scripts'], () => {
  // ...
});
```

```js
gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['views', 'styles', 'scripts', 'fonts'], () => {
    // ...
  });
});
```

### 7. Configure `html` task to include files from `.tmp`

```diff
 gulp.task('html', ['styles', 'views', 'scripts'], () => {
-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
     .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
     .pipe(gulp.dest('dist'));
 });
```

### 8. Update `extras`

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

### 9. Configure `wiredep` task to wire Bower components on layout templates only

Wiredep does not support `.njk` ([yet](https://github.com/taptapship/wiredep/pull/258)), so also add in the file type definition.

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


### 10. Edit your `serve` task

Edit your `serve` task so that editing `.html` and `.njk` files triggers the `views:reload` task:

```diff
  gulp.task('serve', ['views', 'styles', 'fonts'], () => {
    runSequence(['clean', 'wiredep'], ['views', 'styles', 'scripts', 'fonts'], () => {
      ...

    gulp.watch([
-     'app/*.html',
      'app/scripts/**/*.js',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);
     
+     gulp.watch('app/**/*.{html,njk}', ['views:reload']);
      gulp.watch('app/styles/**/*.scss', ['styles']);
      gulp.watch('app/scripts/**/*.js', ['scripts']);
      gulp.watch('app/fonts/**/*', ['fonts']);
      gulp.watch('bower.json', ['wiredep', 'fonts']);
    });
  });
```

Notice we are still watching `.html` files in `app` because our templates have a different extension.
