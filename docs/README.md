# Getting Started

Welcome to the [gulp][gulp] flavor of our web app generator! If you're not familiar with gulp, we suggest checking out [their docs][gulp-docs].

If you haven't already, install [yo][yo] and this generator by running:

```sh
$ npm install -g yo generator-gulp-webapp
```

Now you can scaffold your very own web app:

```sh
$ mkdir my-webap
$ cd my-webapp
$ yo gulp-webapp
```

To start developing, run:

```sh
$ gulp serve
```

This will fire up a local web server, open http://localhost:9000 in your default browser and watch files for changes, reloading the browser automatically via [LiveReload][lr].

To make a production-ready build of the app, run:

```sh
$ gulp
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

## Sass

SCSS files are compiled in the `styles` task, which you can customize however you want. E.g. to reduce the usage of `calc()` with [postcss-calc][calc], run:

```sh
$ npm install --save-dev postcss-calc
```

and add it to PostCSS:

```js
.pipe($.postcss([
  require('autoprefixer-core')({browsers: ['last 1 version']}),
  require('postcss-calc')
]))
```

## Bower

We keep `bower_components` in the project root, you can read details about that [here](bower.md).

While `gulp serve` is running, installing Bower components will usually be as easy as:

```sh
$ bower install --save jquery
```

Behind the scenes [wiredep][wiredep] will automatically inject assets from your Bower components to your HTML/SCSS files.

Keep in mind that there will sometimes be situations where you will have to do some extra work.

### 1. You ran `bower install` while `gulp serve` wasn't running

`gulp serve` watches `bower.json` and runs `gulp wiredep` on change, so the solution is to simply run `gulp wiredep` yourself.

### 2. There are images/fonts in the component

These are a bit tricky, as they can't be automatically injected. Ideally you would want to put them in a place where the link would work both in development and in production, like we do with Bootstrap, but that's sometimes not possible. In those cases you would need to do some [gulp-replace][replace] trickery.

### 3. Field values in the component's `bower.json` are incorrect or missing

If there's a problem, it's usually with the `main` field, which wiredep uses to wire up assets. Fortunately you can always [override][override] these fields and send a pull request to that component's repository, fixing their `bower.json` :wink:

[gulp]:       https://github.com/gulpjs/gulp
[gulp-docs]:  https://github.com/gulpjs/gulp/blob/master/docs/README.md
[yo]:         https://github.com/yeoman/yo
[lr]:         https://github.com/intesso/connect-livereload
[plugins]:    https://github.com/jackfranklin/gulp-load-plugins
[calc]:       https://github.com/postcss/postcss-calc
[wiredep]:    https://github.com/taptapship/wiredep
[replace]:    https://github.com/lazd/gulp-replace
[override]:   https://github.com/taptapship/wiredep#bower-overrides
