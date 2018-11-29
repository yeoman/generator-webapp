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

Gulp plugins (the ones that begin with `gulp-`) don't have to be `require()`'d. They are automatically picked up by [gulp-load-plugins][plugins] and available through the `$` variable.

## Linting

We use ESLint for linting JavaScript code. You can define rules in your `package.json` under the `"eslint"` field. Alternatively, you can add an `.eslintrc` file to your project root, where you can [configure][eslint-config] ESLint using JavaScript, JSON or YAML.

### The `no-undef` rule and tests

The ESLint rule [`no-undef`] will warn about usage of explicitly undeclared variables and functions. Because our tests use global functions like `describe` and `it` (defined by the testing framework), ESLint will consider those as warnings.

Luckily, the fix is easy—add an `.eslintrc` file to the `test/spec` directory and let ESLint know about your testing framework. For example, if you're using Mocha, add this to `.eslintrc`:

```json
{
  "env": {
    "mocha": true
  }
}
```

Configuration from this `.eslintrc` will merge with your project-wide configuration.

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

You have to add your own JS files manually. For example, let's say you created `app/scripts/nav.js`, defining some special behavior for the navigation. You should then include it in the comment blocks for your _source_ JS files, where `app/scripts/main.js` is located:

```html
<!-- build:js scripts/main.js -->
<script src="scripts/main.js"></script>
<script src="scripts/nav.js"></script>
<!-- endbuild -->
```

Upon build these will be concatenated and compressed into a single file `scripts/main.js`.

The file name in the comment block and the first source aren't related, their name being the same is a pure coincidence. The file name in the comment block specifies how the final optimized file will be called, while the sources should map to your source files.
