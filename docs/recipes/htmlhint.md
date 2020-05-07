# Linting HTML with HTMLHint

In this very simple recipe you'll learn how to set up linting with [HTMLHint] using [gulp-htmlhint].

## Steps

### 1. Install dependencies

We need to install gulp-htmlhint as a dependency:

```sh
$ npm install --save-dev gulp-htmlhint
```

### 2. Create the task

Let's create a task in our `gulpfile.js` which runs HTMLHint across all our HTML files and outputs the error in the terminal:

```js
function htmlhint() {
  return src('app/**/*.html')
    .pipe($.htmlhint())
    .pipe($.htmlhint.reporter());
}
```

Read [gulp-htmlhint's docs][api] to find out how you can pass options to HTMLHint.

### 3. Add the task as the dependency of `serve` and `html`

HTMLHint should run on serve and build.

```diff
 const build = series(
   clean,
   parallel(
     lint,
-    series(parallel(styles, scripts), html),
+    series(parallel(htmlhint, styles, scripts), html),
     images,
     fonts,
     extras
   ),
   measureSize
 );
```

```diff
 let serve;
 if (isDev) {
-  serve = series(clean, parallel(styles, scripts, fonts), startAppServer);
+  serve = series(clean, parallel(htmlhint, styles, scripts, fonts), startAppServer);
 } else if (isTest) {
   serve = series(clean, scripts, startTestServer);
 } else if (isProd) {
   serve = series(build, startDistServer);
 }
```

### 4. Run the task on each HTML change

In the `serve` task add the following line to run `htmlhint` every time a HTML file in the `app` directory changes:

```diff
   watch([
     'app/*.html',
     'app/images/**/*',
     '.tmp/fonts/**/*'
   ]).on('change', server.reload);

+  watch('app/*.html', htmlhint);
   watch('app/styles/**/*.css', styles);
   watch('app/scripts/**/*.js', scripts);
   watch('app/fonts/**/*', fonts);
```

## Usage

This is it! To test if everything is working correctly, try making a syntax error in your HTML file and saving it. You should see the error report in your terminal.

[HTMLHint]: http://htmlhint.com/
[gulp-htmlhint]: https://github.com/bezoerb/gulp-htmlhint
[api]: https://github.com/bezoerb/gulp-htmlhint#api
