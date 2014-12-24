# Setting up Jade

This recipe demonstrates how to set up [Jade](http://jade-lang.com/) as your HTML template engine. In a similar way you can implement a different engine, like [Haml](http://haml.info/).

We assume your directory structure will look something like this:

```
webapp
└── app
    ├── about.jade
    ├── contact.jade
    ├── index.jade
    ├── includes
    │   ├── footer.jade
    │   └── header.jade
    └── layouts
        └── default.jade
```

If you had something different in mind, modify paths accordingly.

## Steps

### 1. Install dependencies

Install the Jade gulp plugin:

```sh
$ npm install --save-dev gulp-jade
```

### 2. Create a `views` task

Add this task to your `gulpfile.js`, it will compile `.jade` files to `.html` files in `.tmp`:

```js
gulp.task('views', function () {
  return gulp.src('app/*.jade')
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('.tmp'));
});
```

We are passing `pretty: true` as an option to get a nice HTML output, otherwise Jade would output the HTML on a single line, which would break our comment blocks for wiredep and useref.

### 3. Add `views` as a dependency of both `html` and `connect`

```js
gulp.task('html', ['views', 'styles'], function () {
    ...
```

```js
gulp.task('connect', ['views', 'styles', 'fonts'], function () {
    ...
```

### 4. Update other tasks

#### `html`

We want to parse the compiled HTML:

```diff
 gulp.task('html', ['views', 'styles'], function () {
   var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe(assets)
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.csso()))
     .pipe(assets.restore())
     .pipe($.useref())
     .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
     .pipe(gulp.dest('dist'));
});
```

#### `extras`

We don't want to copy over `.jade` files in the build process:

```diff
 gulp.task('extras', function () {
   return gulp.src([
     'app/*.*',
     '!app/*.html',
+    '!app/*.jade',
    'node_modules/apache-server-configs/dist/.htaccess'
   ], {
     dot: true
   }).pipe(gulp.dest('dist'));
 });
```

#### `wiredep`

Wiredep supports Jade:

```diff
 gulp.task('wiredep', function () {
   var wiredep = require('wiredep').stream;

   gulp.src('app/styles/*.scss')
     .pipe(wiredep({
       ignorePath: /^(\.\.\/)+/
     }))
     .pipe(gulp.dest('app/styles'));

-  gulp.src('app/*.html')
+  gulp.src('app/layouts/*.jade')
     .pipe(wiredep({
       exclude: ['bootstrap-sass-official'],
       ignorePath: /^(\.\.\/)*\.\./
     }))
     .pipe(gulp.dest('app/layouts'));
 });
```

Assuming your wiredep comment blocks are in the layouts.

#### `watch`

Recompile Jade templates on each change and refresh the browser after an HTML file is compiled:

```diff
 gulp.task('watch', ['connect'], function () {
   var server = $.livereload();

   // watch for changes
   gulp.watch([
     'app/*.html',
+    '.tmp/*.html',
     '.tmp/styles/**/*.css',
     'app/scripts/**/*.js',
     'app/images/**/*'
   ]).on('change', function (file) {
     server.changed(file.path);
   });

+  gulp.watch('app/**/*.jade', ['views']);
   gulp.watch('app/styles/**/*.scss', ['styles']);
   gulp.watch('bower.json', ['wiredep', 'fonts']);
});
```

### 5. Rewrite `index.html` as `layout.jade` + `index.jade`

To do this automatically, check out [html2jade](https://github.com/donpark/html2jade).

#### `app/layouts/default.jade`

```jade
doctype html
html.no-js
  head
    meta(charset='utf-8')
    title My Webapp
    meta(name='description' content='')
    meta(name='viewport' content='width=device-width, initial-scale=1')
    // Place favicon.ico and apple-touch-icon.png in the root directory

    // build:css styles/vendor.css
    // bower:css
    // endbower
    // endbuild

    // build:css styles/main.css
    link(rel='stylesheet' href='styles/main.css')
    // endbuild

    // build:js scripts/vendor/modernizr.js
    script(src='../bower_components/modernizr/modernizr.js')
    // endbuild

  body
    | <!--[if lt IE 10]>
    |     <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    | <![endif]-->

    .container
      .header
        ul.nav.nav-pills.pull-right
          li.active: a(href='#') Home
          li: a(href='#') About
          li: a(href='#') Contact

        h3.text-muted My Webapp

      .jumbotron
        h1 'Allo, 'Allo!
        p.lead Always a pleasure scaffolding your apps.
        p: a.btn.btn-lg.btn-success(href='#') Splendid!

      block content

      .footer
        p ♥ from the Yeoman team

    // Google Analytics: change UA-XXXXX-X to be your site's ID.
    script.
      (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
      function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
      e=o.createElement(i);r=o.getElementsByTagName(i)[0];
      e.src='//www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
      ga('create','UA-XXXXX-X');ga('send','pageview');

    // build:js scripts/vendor.js
    // bower:js
    script(src='../bower_components/jquery/dist/jquery.js')
    // endbower
    // endbuild

    // build:js scripts/plugins.js
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js')
    script(src='../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js')
    // endbuild

    // build:js scripts/main.js
    script(src='scripts/main.js')
    // endbuild
```

#### `app/index.jade`

```jade
extends layouts/default

block content
  .row.marketing
    .col-lg-6
      h4 HTML5 Boilerplate
      p HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.

      h4 Sass
      p Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

      h4 Bootstrap
      p Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.

      h4 Modernizr
      p Modernizr is an open-source JavaScript library that helps you build the next generation of HTML5 and CSS3-powered websites.
```

### 6. Celebrate

This wasn't the simplest recipe ever; go grab a :beer: or something.
