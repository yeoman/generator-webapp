# Setting up CoffeeScript

With this setup you can freely mix `.js` and `.coffee` files in your `app/scripts` directory, and everything will just work.


## Steps


### 1. Install the [gulp-coffee](https://github.com/wearefractal/gulp-coffee) plugin

```
$ npm install --save-dev gulp-coffee
```

### 2. app/scripts:

#### 2.1 Create a `scripts` task

This compiles `.coffee` files into the `.tmp/scripts` directory.

```js
gulp.task('scripts', () => {
  return gulp.src('app/scripts/**/*.coffee')
    .pipe($.coffee())
    .pipe(gulp.dest('.tmp/scripts'));
});
```

#### 2.2 Add `scripts` as a dependency of `html`, `serve`, `server:test`, and `build`

```js
gulp.task('html', ['styles', 'scripts'], () => {
    ...
```

```js
gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  ...
```

```js
gulp.task('serve:test', ['scripts'], () => {
  ...
```

```js
gulp.task('build', ['lint', 'html', 'scripts', 'images', 'fonts', 'extras'], () => {
  ...
```


#### 2.3 Edit your `serve` task

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

### 3. Tests:

#### 3.1 Create a `scripts:test` task

This compiles `.coffee` files into the `.tmp/spec` directory.

```js
gulp.task('scripts:test', () => {
  return gulp.src('test/spec/**/*.coffee')
    .pipe($.coffee())
    .pipe(gulp.dest('.tmp/spec'));
});
```

#### 3.2 Add `scripts:test` as a dependency of `serve:test`

```js
gulp.task('serve:test', ['scripts', 'scripts:test'], () => {
    ...
```

#### 3.3 Edit your `serve:test` task

These changes ensure that (1) generated `.js` files trigger a browser reload, and (2) edits to `.coffee` files trigger recompilation in both scripts and spec.

```diff
 gulp.task('serve:test', ['scripts', 'scripts:test'], () => {
   browserSync({
     notify: false,
     port: 9000,
     ui: false,
     server: {
+      baseDir: ['.tmp', 'test'],
       routes: {
         '/bower_components': 'bower_components'
       }
     }
   });

   gulp.watch('test/spec/**/*.js').on('change', reload);
+  gulp.watch('test/spec/**/*.coffee', ['scripts:test', reload]);
   gulp.watch('test/spec/**/*.js', ['lint:test']);
 });
```

## Usage

- Put your `.coffee` files in `app/scripts` and `test/spec`, and include them in your HTML as if they're `.js` files (e.g. `app/scripts/foo.coffee` => `<script src="scripts/foo.js"></script>`).

- It's fine to have a mixture of `.js` and `.coffee` files in your `app/scripts` directory. If two files have the same name, the `.coffee` one will take precedence (not that you'd ever have any reason to do this).
