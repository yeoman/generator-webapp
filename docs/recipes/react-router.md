# Setting up React Router in addition to React and JSX

This recipe builds on the React recipe and gets you set up with React Router in addition to React and JSX.

## Steps

### 1. React recipe

Follow the steps in the [React recipe](https://github.com/yeoman/generator-gulp-webapp/blob/master/docs/recipes/react.md) to get set up with React and JSX.

### 2. Add dependencies

Install [React Router](https://github.com/rackt/react-router):

```sh
$ npm install react-router --save-dev
```

Install [webpack](https://github.com/webpack/webpack), a bundler for JavaScript modules:

```sh
$ npm install webpack --save-dev
```

### 3. Add a `webpack` script

Add a file `webpack.js` in `app/scripts/` and add the following code to include React and React Router:

```js
window.React = require('react');
window.Router = require('react-router');
```

### 3. Create a `webpack` task

At the top of the gulpfile, add:

```js
import webpack from 'webpack';
```

Add the task. This task bundles the webpack script, including React Router, and outputs it in `.tmp/scripts`.

```js
gulp.task('webpack', function(callback) {
  webpack({
    entry: './app/scripts/webpack.js',
    output: {
      path: '.tmp/scripts/',
      filename: 'bundle.js',
    },
  }, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    callback();
  });
});
```

### 4. Add `webpack` as a dependency of `html` and `serve`

```js
gulp.task('html', ['styles', 'templates', 'webpack'], function () {
  ...
```

```js
gulp.task('serve', ['styles', 'templates', 'webpack', 'fonts'], function () {
  ...
```

### 5. Edit your `serve` task

Edit your `serve` task so that editing the `webpack.js` file triggers the `webpack` task, and (b) the browser is refreshed whenever a `.js` file is generated in `.tmp/scripts`:

```diff
 gulp.task('serve', ['styles', 'templates', 'fonts'], function () {
   ...
   gulp.watch([
     'app/*.html',
     '.tmp/styles/**/*.css',
     'app/scripts/**/*.js',
    '.tmp/scripts/**/*.js',
     'app/images/**/*'
   ]).on('change', reload);

   gulp.watch('app/styles/**/*.scss', ['styles', reload]);
   gulp.watch('app/scripts/**/*.jsx', ['templates', reload]);
+  gulp.watch('app/scripts/**/webpack.js', ['webpack']);
   gulp.watch('bower.json', ['wiredep', 'fonts', reload]);
 });
```

### 6. Add the bundled script reference

Insert a script tag into your `app/index.html`:

```
    <!-- build:js scripts/main.js -->
+   <script src="scripts/bundle.js"></script>
```
