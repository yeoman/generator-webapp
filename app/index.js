'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('babel', {
      desc: 'Use Babel',
      type: Boolean,
      defaults: true
    });
  }

  initializing() {
    this.pkg = require('../package.json');
    this.composeWith(
      require.resolve(`generator-${this.options['test-framework']}/generators/app`),
      { 'skip-install': this.options['skip-install'] }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app.'));
    }

    const prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'Which additional features would you like to include?',
      choices: [{
        name: 'Sass',
        value: 'includeSass',
        checked: true
      }, {
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      }, {
        name: 'Modernizr',
        value: 'includeModernizr',
        checked: true
      }]
    }, {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true,
      when: answers => !answers.features.includes('includeBootstrap')
    }];

    return this.prompt(prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.includes(feat);

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeJQuery = answers.includeJQuery;

    });
  }

  writing() {
    this._writingModernizr();
    this._writingGulpfile();
    this._writingPackageJSON();
    this._writingBabel();
    this._writingGit();
    this._writingEditorConfig();
    this._writingH5bp();
    this._writingStyles();
    this._writingScripts();
    this._writingHtml();
    this._writingMisc();
  }

  _writingModernizr() {
    if(this.includeModernizr) {
      this.fs.copy(
        this.templatePath('modernizr.json'),
        this.destinationPath('modernizr.json')
      );
    }
  }
  _writingGulpfile() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.pkg.name,
        version: this.pkg.version,
        includeSass: this.includeSass,
        includeBootstrap: this.includeBootstrap,
        includeBabel: this.options['babel'],
        testFramework: this.options['test-framework']
      }
    );
  }

  _writingPackageJSON() {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        includeSass: this.includeSass,
        includeBabel: this.options['babel'],
        includeJQuery: this.includeJQuery,
        includeBootstrap: this.includeBootstrap,
        includeModernizr: this.includeModernizr
      }
    );
  }

  _writingBabel() {
    this.fs.copy(
      this.templatePath('babelrc'),
      this.destinationPath('.babelrc')
    );
  }

  _writingGit() {
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes'));
  }

  _writingEditorConfig() {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
  }

  _writingH5bp() {
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath('app/favicon.ico')
    );

    this.fs.copy(
      this.templatePath('apple-touch-icon.png'),
      this.destinationPath('app/apple-touch-icon.png')
    );

    this.fs.copy(
      this.templatePath('robots.txt'),
      this.destinationPath('app/robots.txt'));
  }

  _writingStyles() {
    let css = 'main';

    if (this.includeSass) {
      css += '.scss';
    } else {
      css += '.css';
    }

    this.fs.copyTpl(
      this.templatePath(css),
      this.destinationPath('app/styles/' + css),
      {
        includeBootstrap: this.includeBootstrap
      }
    );
  }

  _writingScripts() {
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('app/scripts/main.js'),
      {
        includeBootstrap: this.includeBootstrap
      }
    );
  }

  _writingHtml() {
    let bsPath, bsPlugins;

    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      {
        appname: this.appname,
        includeSass: this.includeSass,
        includeBootstrap: this.includeBootstrap,
        includeModernizr: this.includeModernizr,
        includeJQuery: this.includeJQuery,
        bsPath,
        bsPlugins
      }
    );
  }

  _writingMisc() {
    mkdirp('app/images');
    mkdirp('app/fonts');
  }

  install() {
    const hasYarn = commandExists('yarn');
    this.installDependencies({
      npm: !hasYarn,
      yarn: hasYarn,
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }
};
