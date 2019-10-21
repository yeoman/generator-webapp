# Setting up Less

This is an easy way to set up Less, including integration with `watch` and LiveReload.


## Steps

### 1. *Choose Sass* when running the generator

It sounds odd but this is the easiest way, because the task tree will be set up correctly for CSS preprocessing, and you can just switch out all the Sass or CSS references to Less ones.

### 2. Switch your npm dependencies

Remove gulp-sass if you have selected it and install [gulp-less](https://github.com/plus3network/gulp-less) instead:

```
$ npm uninstall --save-dev gulp-sass && npm install --save-dev gulp-less
```

### 3. Edit the `styles` and `watch` tasks

```diff
function styles() {
- return src('app/styles/*.css')
+ return src('app/styles/*.less')
    .pipe($.if(!isProd, $.sourcemaps.init()))
-   .pipe($.postcss([
-     autoprefixer()
-   ]))
+   .pipe($.less({
+     paths: ['.']
+   }))
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

Then verify that `gulp build` and `gulp serve` work correctly. While `gulp serve` is running you should be able to edit your `main.less` and see the styles dynamically update in your browser.