# Web app generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-webapp.svg?branch=master)](http://travis-ci.org/yeoman/generator-webapp) [![Gitter](https://img.shields.io/badge/Gitter-Join_the_Yeoman_chat_%E2%86%92-00d06f.svg)](https://gitter.im/yeoman/yeoman)

> [Yeoman](http://yeoman.io) generator that scaffolds out a front-end web app using [gulp](http://gulpjs.com/) for the build process

![](screenshot.png)


## Features

Please see our [gulpfile](app/templates/gulpfile.js) for up to date information on what we support.

* enable [ES2015 features](https://babeljs.io/docs/learn-es2015/) using [Babel](https://babeljs.io)
* CSS Autoprefixing
* Built-in preview server with BrowserSync
* Automagically compile Sass with [libsass](http://libsass.org)
* Automagically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
* Automagically wire-up dependencies installed with [Bower](http://bower.io)

*For more information on what this generator can do for you, take a look at the [gulp plugins](app/templates/_package.json) used in our `package.json`.*


## libsass

Keep in mind that libsass is feature-wise not fully compatible with Ruby Sass. Check out [this](http://sass-compatibility.github.io) curated list of incompatibilities to find out which features are missing.

If your favorite feature is missing and you really need Ruby Sass, you can always switch to [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and update the `styles` task in gulpfile accordingly.


## Getting Started

- Install dependencies: `npm install --global yo gulp-cli bower`
- Install the generator: `npm install --global generator-webapp`
- Run `yo webapp` to scaffold your webapp
- Run `gulp serve` to preview and watch for changes
- Run `bower install --save <package>` to install frontend dependencies
- Run `gulp serve:test` to run the tests in the browser
- Run `gulp` to build your webapp for production
- Run `gulp serve:dist` to preview the production build


## Docs

* [getting started](docs/README.md) with this generator
* [recipes](docs/recipes/README.md) for integrating other popular technologies like CoffeeScript
* [details](docs/bower.md) about our Bower setup
* [contribution](contributing.md) docs and [FAQ](docs/faq.md), good to check before posting an issue


## Options

- `--skip-welcome-message`
  Skips Yeoman's greeting before displaying options.
- `--skip-install-message`
  Skips the the message displayed after scaffolding has finished and before the dependencies are being installed.
- `--skip-install`
  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.
- `--test-framework=<framework>`
  Either `mocha` or `jasmine`. Defaults to `mocha`.
- `--no-babel`
  Scaffolds without [Babel](http://babeljs.io) support. This only applies to `app/scripts`, you can still write ES2015 in the gulpfile, depending on what your version of Node [supports](https://kangax.github.io/compat-table/es6/).


## Contribute

See the [contributing docs](contributing.md).


## Sponsors
Love Yeoman work and community? Help us keep it alive by donating funds to cover project expenses! <br />
[[Become a sponsor](https://opencollective.com/yeoman#support)]

  <a href="https://opencollective.com/yeoman/backers/0/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/0/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/1/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/1/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/2/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/2/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/3/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/3/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/4/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/4/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/5/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/5/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/6/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/6/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/7/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/7/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/8/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/8/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/9/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/9/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/10/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/10/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/11/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/11/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/12/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/12/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/13/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/13/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/14/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/14/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/15/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/15/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/16/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/16/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/17/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/17/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/18/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/18/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/19/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/19/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/20/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/20/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/21/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/21/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/22/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/22/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/23/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/23/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/24/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/24/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/25/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/25/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/26/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/26/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/27/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/27/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/28/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/28/avatar">
  </a>
  <a href="https://opencollective.com/yeoman/backers/29/website" target="_blank">
    <img src="https://opencollective.com/yeoman/backers/29/avatar">
  </a>


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
