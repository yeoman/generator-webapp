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
gulp.task('htmlhint', () => {
  return gulp.src('app/**/*.html')
    .pipe($.htmlhint())
    .pipe($.htmlhint.reporter());
});
```

Read [gulp-htmlhint's docs][api] to find out how you can pass options to HTMLHint.

### 3. Add the task as the dependency of `serve` and `html`

HTMLHint should run on serve and build.

```js
gulp.task('html', ['htmlhint', 'styles', 'scripts'], () => {
```

```js
gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['htmlhint', 'styles', 'scripts', 'fonts'], () => {
```

### 4. Run the task on each HTML change

In the `serve` task add the following line to run `htmlhint` every time a HTML file in the `app` directory changes:

```diff
+gulp.watch('app/**/*.html', ['htmlhint']);
 gulp.watch('app/styles/**/*.scss', ['styles']);
 gulp.watch('app/scripts/**/*.js', ['scripts']);
 gulp.watch('app/fonts/**/*', ['fonts']);
 gulp.watch('bower.json', ['wiredep', 'fonts']);
```

## Usage

This is it! To test if everything is working correctly, try making a syntax error in your HTML file and saving it. You should see the error report in your terminal.

[HTMLHint]: http://htmlhint.com/
[gulp-htmlhint]: https://github.com/bezoerb/gulp-htmlhint
[api]: https://github.com/bezoerb/gulp-htmlhint#api
