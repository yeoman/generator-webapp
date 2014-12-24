# Setting up Handlebars

This recipe shows how to set up Handlebars to precompile your templates, including LiveReload integration.


## Steps

### 1. Install dependencies

Install some gulp plugins:

```sh
$ npm install --save-dev gulp-handlebars gulp-define-module gulp-declare
```

* [gulp-handlebars](https://github.com/lazd/gulp-handlebars) precompiles raw `.hbs` templates into JavaScript
* [gulp-define-module](https://github.com/wbyoung/gulp-define-module) and [gulp-declare](https://github.com/lazd/gulp-declare) are used together to package up the compiled JavaScript template into a namespaced module

Install Handlebars as a bower component:

```sh
$ bower install --save handlebars
```

* You need this so you can include the Handlebars runtime in your page – even compiled templates depend on this. (You won't need to include the entire Handlebars library though.)
* It's a good idea to verify you've installed the same version of Handlebars as the one used by internally by gulp-handlebars, to guarantee compatibility between the runtime and your compiled templates. Look in `node_modules/gulp-handlebars/package.json` under `"dependencies"` and check the handlebars version – if necessary, you can ask bower to install that specific version, e.g. `bower install --save handlebars#^1.3.0`.

### 2. Create a `templates` task

```js
gulp.task('templates', function () {
  return gulp.src('app/templates/**/*.hbs')
    .pipe($.handlebars())
    .pipe($.defineModule('plain'))
    .pipe($.declare({
      namespace: 'MyApp.templates' // change this to whatever you want
    }))
    .pipe(gulp.dest('.tmp/templates'));
});
```

> This compiles `.hbs` files into `.js` files in the `.tmp` directory.

### 3. Add `templates` as a dependency of both `html` and `connect`

```js
gulp.task('html', ['styles', 'templates'], function () {
  ...
```

```js
gulp.task('connect', ['styles', 'templates', 'fonts'], function () {
    ...
```

### 4. Configure watch

Edit your `watch` task so that (a) editing an `.hbs` file triggers the `templates` task, and (b) the LiveReload server is triggered whenever a `.js` file is generated in `.tmp/templates`:

```diff
 gulp.task('watch', ['connect'], function () {
   gulp.watch([
     'app/*.html',
     '.tmp/styles/**/*.css',
+    '.tmp/templates/**/*.js',
     'app/scripts/**/*.js',
     'app/images/**/*'
   ]).on('change', function (file) {
     server.changed(file.path);
   });

   gulp.watch('app/styles/**/*.scss', ['styles']);
+  gulp.watch('app/templates/**/*.hbs', ['templates']);
   gulp.watch('bower.json', ['wiredep', 'fonts']);
 });
```

## Usage

Put `.hbs` files in `app/templates`, and include them in your HTML as if they're `.js` files.

Example – if you've written a template at `app/templates/foo.hbs`:

```html
<script src="bower_components/handlebars/handlebars.runtime.js"></script>
<script src="templates/foo.js"></script>
<script src="scripts/main.js"></script>
```

You would then render the template like this:

```js
var html = MyApp.templates.foo();
```

The `MyApp.templates` namespace can be anything you want – change it in the `templates` task.
