# Setting up Pug (formerly known as Jade)

This recipe demonstrates how to set up [Pug](https://pugjs.org) as your HTML template engine. In a similar way you can implement a different engine, like [Haml](http://haml.info/).

We assume your directory structure will look something like this:

```
webapp
└── app
    ├── about.pug
    ├── contact.pug
    ├── index.pug
    ├── includes
    │   ├── footer.pug
    │   └── header.pug
    └── layouts
        └── default.pug
```

If you had something different in mind, modify paths accordingly.

## Steps

### 1. Install dependencies

Install the Pug gulp plugin:

```
$ npm install --save-dev gulp-pug
```

### 2. Create a `views` task

Add this task to your `gulpfile.js`, it will compile `.pug` files to `.html` files in `.tmp`:

```js
gulp.task('views', () => {
  return gulp.src('app/*.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest('.tmp'))
    .pipe(reload({stream: true}));
});
```

We are passing `pretty: true` as an option to get a nice HTML output, otherwise Pug would output the HTML on a single line, which would break our comment blocks for wiredep and useref.

### 3. Add `views` as a dependency of both `html` and `serve`

```js
gulp.task('html', ['views', 'styles', 'scripts'], () => {
    ...
```

```js
gulp.task('serve', ['views', 'styles', 'scripts', 'fonts'], () => {
    ...
```

### 4. Update other tasks

#### `html`

We want to parse the compiled HTML:

```diff
 gulp.task('html', ['views', 'styles'], () => {
-  return gulp.src('app/*.html')
+  return gulp.src(['app/*.html', '.tmp/*.html'])
     .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
     .pipe($.if('*.js', $.uglify()))
     .pipe($.if('*.css', $.cssnano()))
     .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
     .pipe(gulp.dest('dist'));
});
```

#### `extras`

We don't want to copy over `.pug` files in the build process:

```diff
 gulp.task('extras', () => {
   return gulp.src([
     'app/*.*',
-    '!app/*.html'
+    '!app/*.html',
+    '!app/*.pug'
   ], {
     dot: true
   }).pipe(gulp.dest('dist'));
 });
```

#### `wiredep`

Wiredep supports Pug:

```diff
 gulp.task('wiredep', () => {
   gulp.src('app/styles/*.scss')
     .pipe(wiredep({
       ignorePath: /^(\.\.\/)+/
     }))
     .pipe(gulp.dest('app/styles'));

-  gulp.src('app/*.html')
+  gulp.src('app/layouts/*.pug')
     .pipe(wiredep({
       exclude: ['bootstrap-sass'],
-      ignorePath: /^(\.\.\/)*\.\./
       ignorePath: /^(\.\.\/)*\.\./,
       fileTypes: {
         pug: {
           block: /(([ \t]*)\/\/-?\s*bower:*(\S*))(\n|\r|.)*?(\/\/-?\s*endbower)/gi,
           detect: {
             js: /script\(.*src=['"]([^'"]+)/gi,
             css: /link\(.*href=['"]([^'"]+)/gi
           },
           replace: {
             js: 'script(src=\'{{filePath}}\')',
             css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
           }
         }
       }
     }))
-    .pipe(gulp.dest('app'));
+    .pipe(gulp.dest('app/layouts'));
 });
```

Assuming your wiredep comment blocks are in the layouts.

#### `serve`

Recompile Pug templates on each change and reload the browser after an HTML file is compiled:

```diff
 gulp.task('serve', () => {
-   runSequence(['clean', 'wiredep'], ['styles', 'scripts', fonts'], () => {
+   runSequence(['clean', 'wiredep'], ['views', 'styles', 'scripts', 'fonts'], () => {
   ...
   gulp.watch([
     'app/*.html',
     'app/images/**/*',
     '.tmp/fonts/**/*'
   ]).on('change', reload);

+  gulp.watch('app/**/*.pug', ['views']);
   gulp.watch('app/styles/**/*.scss', ['styles']);
   gulp.watch('app/scripts/**/*.js', ['scripts']);
   gulp.watch('app/fonts/**/*', ['fonts']);
   gulp.watch('bower.json', ['wiredep', 'fonts']);
});
```

### 5. Rewrite `index.html` as `layout.pug` + `index.pug`

To partially automatize this job, you can use [html2jade](https://github.com/donpark/html2jade). However, at the time of this writing html2jade has some drawbacks (e.g. doesn't support conditional comments) and the output requires cleanup.

#### `app/layouts/default.pug`

```pug
doctype html
html.no-js(lang='')
  head
    meta(charset='utf-8')
    meta(name='description', content='')
    meta(name='viewport', content='width=device-width, initial-scale=1')
    title webapp
    link(rel='apple-touch-icon', href='apple-touch-icon.png')
    // Place favicon.ico in the root directory

    // build:css styles/vendor.css
    // bower:css
    // endbower
    // endbuild

    // build:css styles/main.css
    link(rel='stylesheet', href='styles/main.css')
    // endbuild

    // build:js scripts/vendor/modernizr.js
    script(src='/bower_components/modernizr/modernizr.js')
    // endbuild
  body
    <!--[if lt IE 10]>
      p.browserupgrade You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
    <![endif]-->
    .container
      .header
        ul.nav.nav-pills.pull-right
          li.active: a(href='#') Home
          li: a(href='#') About
          li: a(href='#') Contact

        h3.text-muted webapp

      block content

      .footer
        p &hearts; from the Yeoman team

    // Google Analytics: change UA-XXXXX-X to be your site's ID.
    script.
      (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
      function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
      e=o.createElement(i);r=o.getElementsByTagName(i)[0];
      e.src='https://www.google-analytics.com/analytics.js';
      r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
      ga('create','UA-XXXXX-X');ga('send','pageview');

    // build:js scripts/vendor.js
    // bower:js
    script(src='/bower_components/jquery/dist/jquery.js')
    script(src='/bower_components/modernizr/modernizr.js')
    // endbower
    // endbuild

    // build:js scripts/plugins.js
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js')
    script(src='/bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js')
    // endbuild

    // build:js scripts/main.js
    script(src='scripts/main.js')
    // endbuild
```

#### `app/index.pug`

```pug
extends layouts/default

block content
  .jumbotron
    h1 'Allo, 'Allo!
    p.lead Always a pleasure scaffolding your apps.
    p: a.btn.btn-lg.btn-success(href='#') Splendid!

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

### 6. Test

Check if everything is working properly. Run `gulp serve` and try changing a `.pug` file to see if the page updates etc.

### 7. Celebrate

This wasn't exactly the simplest recipe ever; go grab a :beer: or something.
