# Setting up Liquify

With this setup you can use the [Liquid template language][liquid] (a template language which is used by [Shopify][shopify] and also [Jekyll][jekyll]) inside your HTML files to reduce duplications, make dynamic contents, and have fun using this cool template language!


## Steps

### 1. Install the required plugin

```
$ npm install --save-dev gulp-liquify
```

### 2. Create a `liquify` task

This task preprocesses your HTML files which used the Liquid template language and outputs the final files in `.tmp`.

`liquify` method accepts your local object (an object which holds your local variables, the ones that can be accessed inside your Liquid templates) as the first argument; and a base directory for your templates to be included in an other template as the second argument.

```js
gulp.task('liquify', () => {
  gulp.src('app/*.{html,liquid}')
    .pipe($.liquify({}, {base: 'app/_includes'}))
    .pipe(gulp.dest('.tmp'));
});
```

### 3. Edit your `html` task

Edit your `html` task so that (a) the `liquify` be as a dependency for it so that the generated HTML files be ready in `.tmp` before `html` task starts up, and (b) `html` task's gulp source will be the HTML files in `.tmp`, I mean the final generated files which are ready to be used by the `html` task.

```js
gulp.task('html', ['liquify', 'styles', 'scripts'], () => {
  return gulp.src('.tmp/*.html')
  ...
```

### 4. Edit your `serve` task

Edit your `serve` task so that (a) the `liquify` be as a dependency for it so that the generated HTML files be ready in `.tmp` before `serve` task starts up, and (b) let gulp watch the HTML files in `.tmp` instead and also run the `liquify` task if any `.html` or `.liquid` file in `app` or `app/_includes` has been modified.

```js
gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['liquify', 'styles', 'scripts', 'fonts'], () => {
    ...
```

```diff
gulp.task('serve', () => {
  ...

    gulp.watch([
-      'app/*.html',
+      '.tmp/*.html',
      'app/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

+    gulp.watch(['app/*.{html,liquid}', 'app/_includes/*.{html,liquid}'], ['liquify']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});
```

## Usage

- Put your Liquid templates in `app/_includes`, and include them in any of your `.html` or `.liquid` files.
- Of course you can also easily use all of the other Liquid template language features such as tags, filters, operators, and etc...

For example, you can have `head.liquid` template in `app/_includes`:

```html
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="stylesheet" href="styles/{{style_name}}.css">
```

And let your `index.html` in `app` include it:

```html
<!doctype html>
<html class="no-js" lang="en">
  <head>
    {% assign style_name = "dark" %}
    {% include head.liquid %}
    <meta name="description" content="">
    <title>Your Title</title>
  </head>
  <body>
    ...
  </body>
</html>
```

[liquid]: http://shopify.github.io/liquid/
[shopify]: https://www.shopify.com/
[jekyll]: https://jekyllrb.com/
