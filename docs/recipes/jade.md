# Setting up Jade

This recipe demonstrates how to set up [Jade](http://jade-lang.com/) as your HTML template engine. In a similar way you can implement a different engine, like [Haml](http://haml.info/).

## Steps

### 1. Install dependencies

Install the Jade gulp plugin:

```sh
$ npm install --save-dev gulp-jade
```

### 2. Create a `views` task

Add this task to your `gulpfile.js`, it will compile `.jade` files to `.tmp`:

```js
gulp.task('views', function () {
    return gulp.src(['app/*.jade', '!app/layout.jade'])
        .pipe($.jade({pretty: true}))
        .pipe(gulp.dest('.tmp'));
});
```

* This assumes your layout file is `app/layout.jade`, if it's not, rename the path accordingly.
* We are ignoring the layout file, otherwise it would compile to `.tmp/layout.html`.
* We are passing `pretty: true` as an option to get a nice HTML output, otherwise Jade would output the HTML on a single line, which would break our comment blocks for wiredep and useref.

### 3. Add `views` as a dependency of both `html` and `serve`

```js
gulp.task('html', ['views', 'styles', 'scripts'], function () {
    // ...
```

```js
gulp.task('serve', ['connect', 'views', 'styles'], function () {
    // ...
```

### 4. Update other tasks

#### `html`

We want to parse the compiled HTML:

```diff
gulp.task('html', ['views', 'styles', 'scripts'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');

-   return gulp.src('app/*.html')
+   return gulp.src('.tmp/*.html')
        .pipe($.useref.assets({searchPath: '{.tmp,app}'}))
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe($.useref.restore())
        .pipe($.useref())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});
```

#### `extras`

We don't want to copy over `.jade` files in the build process:

```diff
gulp.task('extras', function () {
-   return gulp.src(['app/*.*', '!app/*.html'], { dot: true })
+   return gulp.src(['app/*.*', '!app/*.jade'], { dot: true })
        .pipe(gulp.dest('dist'));
});
```

#### `wiredep`

Wiredep supports Jade:

```diff
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    gulp.src('app/styles/*.scss')
        .pipe(wiredep({
            directory: 'app/bower_components'
        }))
        .pipe(gulp.dest('app/styles'));

-   gulp.src('app/*.html')
+   gulp.src('app/*.jade')
        .pipe(wiredep({
            directory: 'app/bower_components',
            exclude: ['bootstrap-sass-official']
        }))
        .pipe(gulp.dest('app'));
});
```

#### `watch`

Recompile Jade templates on each change and refresh the browser after an HTML file is compiled:

```diff
gulp.task('watch', ['connect', 'serve'], function () {
    var server = $.livereload();

    // watch for changes

    gulp.watch([
-       'app/*.html',
+       '.tmp/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', function (file) {
        server.changed(file.path);
    });

+   gulp.watch('app/*.jade', ['views']);
    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
    gulp.watch('bower.json', ['wiredep']);
});
```

### 5. Rewrite `index.html` as `layout.jade` + `index.jade`

This is just one way to do it, organize your templates however you want.

`app/layout.jade`:

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

`app/index.jade`:

```jade
extends layout

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

This wasn't exactly the simplest recipe in the world; go grab a :beer: or something.
