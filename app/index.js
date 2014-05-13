'use strict';

var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var AppGenerator = module.exports = function Appgenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-message': options['skip-install-message'],
        'skip-install': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = require('../package.json');
};

require('util').inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    this.log(require('yosay')());
    this.log(chalk.magenta(
      'Out of the box I include HTML5 Boilerplate, jQuery, and a ' +
      'Gruntfile.js to build your app.'
    ));
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Bootstrap',
      value: 'includeBootstrap',
      checked: true
    },{
      name: 'Sass',
      value: 'includeSass',
      checked: false
    },{
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: false
    }]
  }, {
    when: function (answers) {
      return answers.features.indexOf('includeSass') !== -1;
    },
    type: 'confirm',
    name: 'libsass',
    value: 'includeLibSass',
    message: 'Would you like to use libsass? Read up more at \n' +
      chalk.green('https://github.com/andrew/node-sass#node-sass'),
    default: false
  }];

  this.prompt(prompts, function (answers) {
    var features = answers.features;

    function hasFeature(feat) {
      return features.indexOf(feat) !== -1;
    }

    this.includeSass = hasFeature('includeSass');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    this.includeLibSass = answers.libsass;
    this.includeRubySass = !answers.libsass;

    cb();
  }.bind(this));
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function git() {
  this.template('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.bower = function bower() {
  this.template('_bower.json', 'bower.json');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'app/favicon.ico');
  this.copy('404.html', 'app/404.html');
  this.copy('robots.txt', 'app/robots.txt');
  this.copy('htaccess', 'app/.htaccess');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
  this.copy(css, 'app/styles/' + css);
};

AppGenerator.prototype.writeIndex = function writeIndex() {

  this.indexFile = this.readFileAsString(join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  // wire Bootstrap plugins
  if (this.includeBootstrap) {
    var bs = '../bower_components/bootstrap';
    bs += this.includeSass ?
      '-sass-official/vendor/assets/javascripts/bootstrap/' : '/js/';
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);
  }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js'],
    searchPath: '{app,.tmp}'
  });
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.html', this.indexFile);

  if (this.coffee) {
    this.write(
      'app/scripts/main.coffee',
      'console.log "\'Allo from CoffeeScript!"'
    );
  }
  else {
    this.write('app/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
  }
};

AppGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
