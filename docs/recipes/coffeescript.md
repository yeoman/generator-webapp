# Setting up CoffeeScript

With this setup you can freely mix `.js` and `.coffee` files in your `app/scripts` directory, and everything will just work.

## Steps

### 1. Install the [gulp-coffee](https://github.com/wearefractal/gulp-coffee) plugin

```
npm install --save-dev gulp-coffee
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

### 3. Add `scripts` as a dependency of `html` and `serve`

```js
gulp.task('serve', ['connect', 'styles', 'scripts'], function () {
    ...
```

```js
gulp.task('html', ['styles', 'scripts'], function () {
    ...
```

### 4. Edit your watch task

Make these two changes (indicated by comments) to ensure that (1) generated `.js` files trigger a live reload, and (2) edits to `.coffee` files trigger recompilation.

```js
gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        '{.tmp,app}/scripts/**/*.js', // <--- 1. watch js files in .tmp as well as app
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

    gulp.watch('app/styles/**/*.css', ['styles']);
    gulp.watch('app/scripts/**/*.coffee', ['scripts']); // <--- 2. recompile whenever .coffee files change
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
```

## Usage

- Just put your `.coffee` files in `app/scripts`, and include them in your HTML as if they're `.js` files (e.g. `app/scripts/foo.coffee` => `<script src="scripts/foo.js"></script>`).
- It's fine to have a mixture of `.js` and `.coffee` files in your `app/scripts` directory. If two files have the same name, the `.coffee` one will take precedence (not that you'd ever have any reason to do this).
