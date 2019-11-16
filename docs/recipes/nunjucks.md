# Setting up Nunjucks

This recipe shows how to set up Nunjucks to compile your templates.

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

### 2. Convert `app/index.html` into a template `app/layouts/default.njk`

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
function views() {
  return src('app/*.njk')
    .pipe($.nunjucksRender({ path: 'app' }))
    .pipe(dest('.tmp'))
    .pipe(server.reload({ stream: true }));
};
```

This compiles `app/*.njk` files into static `.html` files in the `.tmp` directory.

This triggers Browsersync after `views` task is completed

### 5. Add `views` as a dependency of both `build` and `serve`

```diff
if (isDev) {
- serve = series(clean, parallel(styles, scripts, fonts), startAppServer);
+ serve = series(clean, parallel(views, styles, scripts, fonts), startAppServer);
} else if (isTest) {
- serve = series(clean, scripts, startTestServer);
+ serve = series(clean, parallel(views, scripts), startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}
```

```diff
const build = series(
  clean,
  parallel(
    lint,
-   series(parallel(styles, scripts), html),
+   series(parallel(views, styles, scripts), html),
    images,
    fonts,
    extras
  ),
  measureSize
);
```

### 6. Configure `html` task to include files from `.tmp`

```diff
function html() {
-  return src(['app/*.html'])
+  return src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
  ...
```

### 7. Update `extras`

We don't want to copy over `.njk` files in the build process:

```diff
function extras() {
  return src([
    'app/*',
-    '!app/*.html'
+    '!app/*.html',
+    '!app/*.njk'
  ], {
    dot: true
  }).pipe(dest('dist'));
};
```

### 8. Edit your `serve` task

Edit your `serve` task so that editing `.html` and `.njk` files triggers the `views` task:

```diff
 watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

+ watch('app/**/*.{html,njk}', views);
  watch('app/styles/**/*.scss', styles);
  watch('app/scripts/**/*.js', scripts);
  watch('app/fonts/**/*', fonts);
});
```

Notice we are still watching `.html` files in `app` because our templates have a different extension.
