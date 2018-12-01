'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const helper = require('./lib/helper');
const config = require('./lib/config');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
  }

  initializing() {
    this.pkg = require('../package.json');
    this.composeWith(
      require.resolve(`generator-${this.options['test-framework']}/generators/app`), {
        'skip-install': this.options['skip-install']
      }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app.'));
    }

    return this.prompt(config.prompts).then(answers => {
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
    const _self = this;
    const data = {
      appname: this.appname,
      date: (new Date).toISOString().split('T')[0],
      name: this.pkg.name,
      version: this.pkg.version,
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      includeBabel: this.options.babel,
      testFramework: this.options['test-framework'],
      includeJQuery: this.includeJQuery,
      includeModernizr: this.includeModernizr
    };

    // Render Files
    config.filesToRender.forEach(file => {
      helper.copyTpl.call(_self, file.input, file.output, data);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      helper.copy.call(_self, file.input, file.output);
    });

    // Create extra directories
    config.dirToCreate.forEach(helper.createDirectory);

    if (this.includeModernizr) {
      helper.copy.call(_self, 'modernizr.json', 'modernizr.json');
    }

    let cssFile = `main.${this.includeSass ? 'scss' : 'css'}`;
    helper.copyTpl.call(_self, cssFile, `app/styles/${cssFile}`, data);
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