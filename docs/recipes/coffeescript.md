# Setting up CoffeeScript

With this setup you can freely mix `.js` and `.coffee` files in your `app/scripts` directory, and everything will just work.


## Steps

### 1. Install the [gulp-coffee](https://github.com/wearefractal/gulp-coffee) plugin

```
$ npm install --save-dev gulp-coffee
```

### 2. Create a `scripts` task

This compiles `.coffee` files into the `.tmp` directory.

```js
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.coffee')
    .pipe($.coffee())
    .pipe(gulp.dest('.tmp/scripts'));
});
```

### 3. Add `scripts` as a dependency of `html` and `serve`

```js
gulp.task('html', ['styles', 'scripts'], () => () {
    ...
```

```js
gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  ...
```

### 4. Edit your `serve` task

These changes ensure that (1) generated `.js` files trigger a browser reload, and (2) edits to `.coffee` files trigger recompilation.

```diff
 gulp.task('serve', ['styles', 'fonts'], () => {
   ...
   gulp.watch([
     'app/*.html',
     '.tmp/styles/**/*.css',
     'app/scripts/**/*.js',
+    '.tmp/scripts/**/*.js',
     'app/images/**/*'
   ]).on('change', reload);

   gulp.watch('app/styles/**/*.scss', ['styles', reload]);
+  gulp.watch('app/scripts/**/*.coffee', ['scripts', reload]);
   gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
 });
```


## Usage

- Put your `.coffee` files in `app/scripts`, and include them in your HTML as if they're `.js` files (e.g. `app/scripts/foo.coffee` => `<script src="scripts/foo.js"></script>`).

- It's fine to have a mixture of `.js` and `.coffee` files in your `app/scripts` directory. If two files have the same name, the `.coffee` one will take precedence (not that you'd ever have any reason to do this).
