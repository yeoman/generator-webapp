# Setting up React Router in addition to React and JSX

This recipe builds on the [React recipe](react.md) and gets you set up with React Router in addition to React and JSX.


## Steps

### 1. React recipe

Follow the steps in the React recipe to get set up with React and JSX.

### 2. Add dependencies

Install [React Router](https://github.com/rackt/react-router) and [webpack](https://github.com/webpack/webpack) (bundler for JavaScript modules):

```
$ npm install --save-dev react-router webpack
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
const webpack = require('webpack');
```

Add the task. This task bundles the webpack script, including React Router, and outputs it in `.tmp/scripts`.

```js
gulp.task('webpack', cb => {
  webpack({
    entry: './app/scripts/webpack.js',
    output: {
      path: '.tmp/scripts/',
      filename: 'bundle.js',
    },
  }, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    cb();
  });
});
```

### 4. Add `webpack` as a dependency of `html` and `serve`

```js
gulp.task('html', ['styles', 'templates', 'webpack'], () => {
  ...
```

```js
gulp.task('serve', ['styles', 'templates', 'webpack', 'fonts'], () => {
  ...
```

### 5. Edit your `serve` task

Edit your `serve` task so that editing the `webpack.js` file triggers the `webpack` task, and (b) the browser is refreshed whenever a `.js` file is generated in `.tmp/scripts`:

```diff
 gulp.task('serve', ['styles', 'templates', 'fonts'], () => {
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

```diff
    <!-- build:js scripts/main.js -->
+   <script src="scripts/bundle.js"></script>
```
