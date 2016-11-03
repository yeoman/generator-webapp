# Getting Started

Welcome to the [gulp] flavor of our web app generator! If you're not familiar with gulp, we suggest checking out [their docs][gulp-docs].

If you haven't already, install [yo] and this generator by running:

```sh
$ npm install --global yo generator-webapp
```

Now you can scaffold your very own web app:

```sh
$ mkdir my-webapp
$ cd my-webapp
$ yo webapp
```

To start developing, run:

```sh
$ gulp serve
```

This will fire up a local web server, open http://localhost:9000 in your default browser and watch files for changes, reloading the browser automatically via [LiveReload].

To run the tests in the browser, run:

```sh
$ gulp serve:test
```

To make a production-ready build of the app, run:

```sh
$ gulp
```

To preview the production-ready build to check if everything is ok:

```sh
$ gulp serve:dist
```

## Tasks

To get the list of available tasks, run:

```sh
$ gulp --tasks
```

## Gulp plugins

As you might have noticed, gulp plugins (the ones that begin with `gulp-`) don't have to be `require()`'d. They are automatically picked up by [gulp-load-plugins][plugins] and available through the `$` variable.

## Serve

We use the `.tmp` directory mostly for compiling assets like SCSS files. It has precedence over `app`, so if you had an `app/index.html` template compiling to `.tmp/index.html`, http://localhost:9000 would point to `.tmp/index.html`, which is what we want.

This system can be a little confusing with the `watch` task, but it's actually pretty simple:

* notify LiveReload when compiled assets change
* run the compile task when source assets change

E.g. if you have Less files, you would want to notify LiveReload when Less files have compiled, i.e. when `.tmp/styles/**/*.css` change, but you would want to compile Less files by running the `styles` task when source files change, i.e. `app/styles/**/*.less`.

### Adding New Assets

#### Sass

A common practice is to have a single, "main", Sass file, then use `@import` statements to add other partials. For example, let's say you created stylesheet for your navigation, `app/styles/_nav.scss`, you can then import it in `app/styles/main.scss` like this:

```scss
@import "nav";
```

#### JavaScript

Our build step uses special `build` comment blocks to mark which assets to concatenate and compress for production. You can see them at the top and bottom of `app/index.html`.

You don't have to worry about new Bower components, their JS files will be automatically injected in your `app/index.html`, but you have to add your own JS files manually. For example, let's say you created `app/scripts/nav.js`, defining some special behavior for the navigation. You should then include it in the comment blocks for your _source_ JS files, where `app/scripts/main.js` is located:

```html
<!-- build:js scripts/main.js -->
<script src="scripts/main.js"></script>
<script src="scripts/nav.js"></script>
<!-- endbuild -->
```

Upon build these will be concatenated and compressed into a single file `scripts/main.js`.

The file name in the comment block and the first source aren't related, their name being the same is a pure coincidence. The file name in the comment block specifies how the final optimized file will be called, while the sources should map to your source files.

## Bower

We keep `bower_components` in the project root, you can read details about that [here](bower.md). Installing Bower components is usually as easy as:

```sh
$ bower install --save jquery
```

Behind the scenes [wiredep] will automatically inject assets from your Bower components to your HTML/SCSS files as soon as you run `gulp serve` or `gulp`. If `gulp serve` was already running while installing the components, the injection will happen immediately.

However, in some situations you'll have to do some extra work:

### 1. There are images/fonts in the component

These are a bit tricky, as they can't be automatically injected. Ideally you would want to put them in a place where the link would work both in development and in production, like we do with Bootstrap, but that's sometimes not possible. In those cases you would need to do some [gulp-replace][replace] trickery.

### 2. Field values in the component's `bower.json` are incorrect or missing

If there's a problem, it's usually with the `main` field, which wiredep uses to wire up assets. Fortunately you can always [override][override] these fields and send a pull request to that component's repository, fixing their `bower.json` :wink:

[gulp]:       https://github.com/gulpjs/gulp
[gulp-docs]:  https://github.com/gulpjs/gulp/blob/master/docs/README.md
[yo]:         https://github.com/yeoman/yo
[LiveReload]: https://github.com/intesso/connect-livereload
[plugins]:    https://github.com/jackfranklin/gulp-load-plugins
[calc]:       https://github.com/postcss/postcss-calc
[wiredep]:    https://github.com/taptapship/wiredep
[replace]:    https://github.com/lazd/gulp-replace
[override]:   https://github.com/taptapship/wiredep#bower-overrides
