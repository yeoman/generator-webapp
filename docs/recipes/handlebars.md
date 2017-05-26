# Setting up Handlebars

This recipe shows how to set up Handlebars to precompile your templates, including LiveReload integration.


## Steps

### 1. Install dependencies

Install some gulp plugins:

```
$ npm install --save-dev gulp-handlebars gulp-define-module gulp-declare gulp-wrap gulp-concat
```

* [gulp-handlebars](https://github.com/lazd/gulp-handlebars) precompiles raw `.hbs` templates into JavaScript
* [gulp-define-module](https://github.com/wbyoung/gulp-define-module) and [gulp-declare](https://github.com/lazd/gulp-declare) are used together to package up the compiled JavaScript template into a namespaced module

Install Handlebars as a bower component:

```
$ bower install --save handlebars
```

* You need this so you can include the Handlebars runtime in your page – even compiled templates depend on this. (You won't need to include the entire Handlebars library though.)
```
// bower.json
{
  "name": "MyApp",
  "dependencies": {
    ...
  },
  "devDependencies": {
    ...
  },
  "overrides": {
    "handlebars": {
      "main": ["handlebars.runtime.js"]
    }
  }
}
```
* It's a good idea to verify you've installed the same version of Handlebars as the one used by internally by gulp-handlebars, to guarantee compatibility between the runtime and your compiled templates. Look in `node_modules/gulp-handlebars/package.json` under `"dependencies"` and check the handlebars version – if necessary, you can ask bower to install that specific version, e.g. `bower install --save handlebars#^1.3.0`.

### 2. Create a `templates` task

```js
gulp.task('templates', () => {
  return gulp.src('app/templates/*.hbs')
    .pipe($.plumber())
    .pipe($.handlebars())
    .pipe($.defineModule('plain'))
    .pipe($.declare({
      namespace: 'MyApp.templates' // change this to whatever you want
    }))
    .pipe($.concat('templates.js'))
    .pipe(gulp.dest('.tmp/templates'));
});
```
This compiles `.hbs` files into `templates.js` file in the `.tmp/templates` directory.

### 2.1 Using Partials

```js
gulp.task('partials', function() {
  return gulp.src('app/templates/partials/*.hbs')
    .pipe($.plumber())
    .pipe($.handlebars())
    .pipe($.wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
      imports: {
        processPartialName: function(fileName) {
          // Escape the output with JSON.stringify
          return JSON.stringify(path.basename(fileName, '.js'));
        }
      }
    }))
    .pipe($.concat('partials.js'))
    .pipe(gulp.dest('.tmp/templates'));
});
```
This compiles the `.hbs` files inside the `templates/partials` directory into `partials.js` file in the `.tmp/templates` directory.

### 3. Add `templates` and `partials` as a dependencies of both `html` and `serve`

```js
gulp.task('html', ['styles', 'templates', 'partials', 'scripts'], () => {
  ...
```

```js
gulp.task('serve', ['styles', 'templates', 'partials', 'scripts', 'fonts'], () => {
    ...
```

### 4. Edit your `serve` task

Edit your `serve` task so that (a) editing an `.hbs` file triggers the `templates` task, and (b) the browser is reloaded whenever a `.js` file is generated in `.tmp/templates`:

```diff
 gulp.task('serve', () => {
-  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'fonts'], () => {
+  runSequence(['clean', 'wiredep'], ['styles', 'scripts', 'templates', 'partials', 'fonts'], () => {
     ...
     gulp.watch([
      'app/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*',
+     '.tmp/templates/**/*.js',
     ]).on('change', reload);

     gulp.watch('app/styles/**/*.scss', ['styles']);
+    gulp.watch('app/templates/*.hbs', ['templates']);
+    gulp.watch('app/templates/partials/*.hbs', ['partials']);
     gulp.watch('app/scripts/**/*.js', ['scripts']);
     gulp.watch('app/fonts/**/*', ['fonts']);
     gulp.watch('bower.json', ['wiredep', 'fonts']);
   });
 });
```

## Usage

Put your `.hbs` files in `app/templates` and `app/templates/partials` (if you using partials), and include in your HTML after the bower components:

```diff
   <!-- build:js scripts/vendor.js -->
   <!-- bower:js -->
   ...
   <!-- endbower -->
   <!-- endbuild -->

   <!-- build:js scripts/main.js -->
+  <script src="templates/templates.js"></script>
+  <script src="templates/partials.js"></script>
   <script src="scripts/main.js"></script>
   <!-- endbuild -->
```

You would then render the template like this:

```js
const html = MyApp.templates.foo();
```

The `MyApp.templates` namespace can be anything you want – change it in the `templates` task.
