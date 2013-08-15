# Web app generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-webapp.png?branch=master)](http://travis-ci.org/yeoman/generator-webapp)

Yeoman generator that scaffolds out a front-end web app.

## Features

* CSS Autoprefixing (new)
* Built-in preview server with LiveReload
* Automatically compile CoffeeScript & Compass
* Automatically lint your scripts 
* Automatically wire up your Bower components. Supports both [with](https://github.com/yeoman/grunt-bower-requirejs) and [without](https://github.com/stephenplusplus/grunt-bower-install) RequireJS.
* Awesome Image Optimization
* PhantomJS Unit Testing
* Optional - RequireJS
* Optional - Twitter Bootstrap for SASS
* Optional - Leaner Modernizr builds (new)

For more information on what `generator-webapp` can do for you, take a look at the [Grunt tasks](https://github.com/yeoman/generator-webapp/blob/master/app/templates/_package.json) used in our `package.json`.

## Getting Started

- Install: `npm install -g generator-webapp`
- Run: `yo webapp`
- Run `grunt` for building and `grunt server` for preview


## Options

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after scaffolding has finished.

* `--test-framework <framework>`

  Defaults to `mocha`. Can be switched for another supported testing framework like `jasmine`.


## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
