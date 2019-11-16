# Setting up Less

This recipe shows how to set up compiling styles with Less.

## Steps

### 1. *Choose Sass* when running the generator

It sounds odd but this is the easiest way, because the task tree will be set up correctly for CSS preprocessing, and you can just switch out all the Sass or CSS references to Less ones.

### 2. Switch your npm dependencies

Remove gulp-sass if you have selected it and install [gulp-less](https://github.com/plus3network/gulp-less) instead:

```
$ npm uninstall --save-dev gulp-sass && npm install --save-dev gulp-less
```

### 3. Edit the `styles` and `startAppServer` tasks

```diff
 function styles() {
-  return src('app/styles/*.css')
+  return src('app/styles/*.less')
     .pipe($.plumber())
     .pipe($.if(!isProd, $.sourcemaps.init()))
-    .pipe($.sass.sync({
-      outputStyle: 'expanded',
-      precision: 10,
-      includePaths: ['.']
-    }).on('error', $.sass.logError))
+    .pipe($.less({
+      paths: ['.']
+    }))
     .pipe($.postcss([
       autoprefixer()
     ]))
     .pipe($.if(!isProd, $.sourcemaps.write()))
     .pipe(dest('.tmp/styles'))
     .pipe(server.reload({stream: true}));
 };
```

```diff
  watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

- watch('app/styles/**/*.css', styles);
+ watch('app/styles/**/*.less', styles);
  watch('app/scripts/**/*.js', scripts);
  watch('app/fonts/**/*', fonts);
   ...
```


### 4. Check that it's working

Delete `app/styles/main.scss` and replace it with your own `main.less`.

Then verify that `npm run build` and `npm start` work correctly. While the server is running you should be able to edit your `main.less` and see the styles dynamically update in your browser.
