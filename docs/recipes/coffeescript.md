# Setting up CoffeeScript

With this setup you can freely mix `.js` and `.coffee` files in your `app/scripts` directory, and everything will just work.


## Steps

### 1. Install the [gulp-coffee](https://github.com/wearefractal/gulp-coffee) plugin

```sh
$ npm install --save-dev gulp-coffee
```

### 2. Create a `scripts` task

This compiles `.coffee` files into the `.tmp` directory.

```js
gulp.task('scripts', function () {
  return gulp.src('app/scripts/**/*.coffee')
    .pipe($.coffee())
    .pipe(gulp.dest('.tmp/scripts'));
});
```

### 3. Add `scripts` as a dependency of `html` and `connect`

```js
gulp.task('html', ['styles', 'scripts'], function () {
    ...
```

```js
gulp.task('connect', ['styles', 'scripts', 'fonts'], function () {
  ...
```

### 4. Edit your `watch` task

These changes ensure that (1) generated `.js` files trigger a live reload, and (2) edits to `.coffee` files trigger recompilation.

```diff
 gulp.task('watch', ['connect'], function () {
   gulp.watch([
     'app/*.html',
     '.tmp/styles/**/*.css',
     'app/scripts/**/*.js',
+    '.tmp/scripts/**/*.js',
     'app/images/**/*'
   ]).on('change', function (file) {
     server.changed(file.path);
   });

   gulp.watch('app/styles/**/*.scss', ['styles']);
+  gulp.watch('app/scripts/**/*.coffee', ['scripts']);
   gulp.watch('bower.json', ['wiredep', 'fonts']);
 });
```


## Usage

- Put your `.coffee` files in `app/scripts`, and include them in your HTML as if they're `.js` files (e.g. `app/scripts/foo.coffee` => `<script src="scripts/foo.js"></script>`).

- It's fine to have a mixture of `.js` and `.coffee` files in your `app/scripts` directory. If two files have the same name, the `.coffee` one will take precedence (not that you'd ever have any reason to do this).
