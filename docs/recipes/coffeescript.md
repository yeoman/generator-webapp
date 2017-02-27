# Setting up CoffeeScript

With this setup you can freely mix `.js` and `.coffee` files in your `app/scripts` directory, and everything will just work.

We strongly suggest to scaffold your app with Babel (the default behavior), that way it's easier to add CoffeeScript support using the existing infrastructure.


## Steps


### 1. Install dependencies the [gulp-coffee](https://github.com/wearefractal/gulp-coffee) plugin

Current setup includes coding in JavaScript, compiling with Babel, and linting with ESLint. We're instead going to code in CoffeeScript and lint with [CoffeeLint](http://www.coffeelint.org/):

```
$ npm install --save-dev gulp-coffee
```

### 2. Compile application code

#### 2.1 Edit the `scripts` task

The task previously only compiled `.js` files with Babel. We need to modify it to also compile `.coffee` files with CoffeeScript. This can be achieved very easily using gulp-if:

```diff
 gulp.task('scripts', () => {
-  return gulp.src('app/scripts/**/*.js')
+  return gulp.src('app/scripts/**/*.{js,coffee}')
     .pipe($.plumber())
     .pipe($.sourcemaps.init())
-    .pipe($.babel())
+    .pipe($.if('.js', $.babel(), $.coffee()))
     .pipe($.sourcemaps.write('.'))
     .pipe(gulp.dest('.tmp/scripts'))
     .pipe(reload({stream: true}));
 });
```

#### 2.2 Edit the `serve` task

We need to tell gulp to recompile `.coffee` files on change, like we're already doing for `.js` files:

```diff
gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
    ...

    gulp.watch('app/styles/**/*.scss', ['styles']);
-   gulp.watch('app/scripts/**/*.js', ['scripts']);
+   gulp.watch('app/scripts/**/*.{js,coffee}', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});
```

### 3. Compile tests

#### 3.1 Create a `scripts:test` task

This task compiles `.coffee` files located in `test/spec` into the `.tmp/spec` directory and reloads the browser.

```js
gulp.task('scripts:test', () => {
  return gulp.src('test/spec/**/*.coffee')
    .pipe($.plumber())
    .pipe($.coffee())
    .pipe(gulp.dest('.tmp/spec'))
    .pipe(reload({stream: true}));
});
```

#### 3.2 Add `scripts:test` as a dependency of `serve:test`

```js
gulp.task('serve:test', ['scripts', 'scripts:test'], () => {
  // ...
});
```

#### 3.3 Edit the `serve:test` task

We should modify this task so that compiled `.js` files are served and that changes to `.coffee` files trigger recompilation of tests:

```diff
 gulp.task('serve:test', ['scripts', 'scripts:test'], () => {
   browserSync({
     notify: false,
     port: 9000,
     ui: false,
     server: {
-      baseDir: ['test'],
+      baseDir: ['.tmp', 'test'],
       routes: {
         '/bower_components': 'bower_components'
       }
     }
   });

   gulp.watch('app/scripts/**/*.js', ['scripts']);
+  gulp.watch('test/spec/**/*.coffee', ['scripts:test']);
   gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
   gulp.watch('test/spec/**/*.js', ['lint:test']);
 });
```

### 4. Lint CoffeeScript files

ESLint only supports JavaScript. In case you'd like to lint `.coffee` files too, we can set that up using CoffeeLint.

#### 4.1 Install the [gulp-coffeelint](https://github.com/janraasch/gulp-coffeelint) plugin and [lazypipe](https://github.com/OverZealous/lazypipe)

```
$ npm install --save-dev gulp-coffeelint lazypipe
```

#### 4.2 Define lazypipe channels

We want to lint `.js` files with ESLint and `.coffee` with CoffeeLint. This is not as trivial as compiling with Babel and CoffeeScript that we set up earlier because, based on the extension, we need to execute _multiple_ actions, not just one.

For this task we will use lazypipe to set up _channels_ for ESLint and CoffeeLint:

```js
const lazypipe = require('lazypipe');

// ...

const eslintChannel = lazypipe()
  .pipe($.eslint, { fix: true })
  .pipe(reload, {stream: true, once: true})
  .pipe($.eslint.format)
  .pipe($.if, !browserSync.active, $.eslint.failAfterError());

const coffeelintChannel = lazypipe()
  .pipe($.coffeelint)
  .pipe($.coffeelint.reporter)
  .pipe($.if, !browserSync.active, $.coffeelint.reporter('fail'))
```

**Note**: We should not _call_ plugins when defining lazypipe channels! We should just pass the reference and arguments as needed, like this:

```js
  .pipe($.eslint, { fix: true })
```

not this:

```js
  .pipe($.eslint({ fix: true }))
```

#### 4.3 Edit `lint` and `lint:test` tasks

Now we should use those channels based on the file extension:

```diff
 function lint(files, options) {
   return gulp.src(files)
-    .pipe($.eslint({ fix: true }))
-    .pipe(reload({stream: true, once: true}))
-    .pipe($.eslint.format())
-    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
+    .pipe($.if('*.js', eslintChannel(), coffeelintChannel()));
 }

 gulp.task('lint', () => {
-  return lint('app/scripts/**/*.js')
+  return lint('app/scripts/**/*.{js,coffee}')
     .pipe(gulp.dest('app/scripts'));
 });
 gulp.task('lint:test', () => {
-  return lint('test/spec/**/*.js')
+  return lint('test/spec/**/*.{js,coffee}')
     .pipe(gulp.dest('test/spec'));
 });
```

## Usage

- Put your `.coffee` files in `app/scripts` and `test/spec`, and include them in your HTML as if they're `.js` files (e.g. `app/scripts/foo.coffee` => `<script src="scripts/foo.js"></script>`).

- It's fine to have a mixture of `.js` and `.coffee` files in your `app/scripts` directory, just make sure they don't have the same basename. If you have both `foo.js` and `foo.coffee`, one will overwrite the other when compiled.
