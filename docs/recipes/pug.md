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
function views() {
  return src('app/*.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(dest('.tmp'))
    .pipe(server.reload({stream: true}));
}
```

We are passing `pretty: true` as an option to get a nice HTML output, otherwise Pug would output the HTML on a single line, which would break our comment blocks for useref.

### 3. Add `views` task to `server` and `build` process

```js
if (isDev) {
  serve = series(clean, parallel(views, styles, scripts, fonts), startAppServer);
} else if (isTest) {
  serve = series(clean, parallel(views, scripts), startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}
    ...
```

```js
const build = series(
  clean,
  parallel(
    lint,
    series(parallel(views, styles, scripts), html),
    images,
    fonts,
    extras
  ),
  measureSize
);
  ...
```

### 4. Update other tasks

#### `html`

We want to parse the compiled HTML:

```diff
function html() {
-  return src(['app/*.html'])
+  return src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
  ...
```

#### `extras`

We don't want to copy over `.pug` files in the build process:

```diff
function extras() {
  return src([
    'app/*',
-    '!app/*.html',
+    '!app/*.html',
+    '!app/*.pug'
  ], {
    dot: true
  }).pipe(dest('dist'));
};
```


#### `serve`

Recompile Pug templates on each change and reload the browser after an HTML file is compiled:

```diff
 watch([
    'app/*.html',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', server.reload);

+ watch('app/**/*.pug', views);
  watch('app/styles/**/*.scss', styles);
  watch('app/scripts/**/*.js', scripts);
  watch('app/fonts/**/*', fonts);
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
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css" type="text/css" />
    // endbuild
    // build:css styles/main.css
    link(rel='stylesheet', href='styles/main.css')
    // endbuild
    // build:js scripts/vendor/modernizr.js
    script(src='scripts/modernizr.js')
    // endbuild
  body
    <!--[if IE]>
      p.browserupgrade You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.
    <![endif]-->
    .container
      .header
        ul.nav.nav-pills.float-right
          li.nav-item: a.nav-link.active(href='#') Home
          li.nav-item: a.nav-link(href='#') About
          li.nav-item: a.nav-link(href='#') Contact

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
    <script type="text/javascript" src="/node_modules/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
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
    h1.display-3 'Allo, 'Allo!
    p.lead Always a pleasure scaffolding your apps.
    p: a.btn.btn-lg.btn-success(href='#') Splendid!

  .row.marketing
    .col-lg-6
      h4 HTML5 Boilerplate
      p HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.

      h4 Sass
      p Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

      <h4>Bootstrap</h4>
      <p>Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.</p>

      h4 Modernizr
      p Modernizr is an open-source JavaScript library that helps you build the next generation of HTML5 and CSS3-powered websites.
```

### 6. Test

Check if everything is working properly. Run `gulp serve` and try changing a `.pug` file to see if the page updates etc.

### 7. Celebrate

This wasn't exactly the simplest recipe ever; go grab a :beer: or something.
