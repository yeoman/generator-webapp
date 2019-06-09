'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const config = require('./config');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
  }

  initializing() {
    this.pkg = require('../package.json');

    if (this.options['skip-test-framework']) {
      return;
    }

    this.composeWith(
      require.resolve(
        `generator-${this.options['test-framework']}/generators/app`
      ),
      {
        'skip-install': this.options['skip-install']
      }
    );
  }

  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(
        yosay(
          "'Allo 'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile to build your app."
        )
      );
    }

    return this.prompt(config.prompts).then(answers => {
      const features = answers.features;
      const hasFeature = feat => features && features.includes(feat);

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = hasFeature('includeSass');
      this.includeBootstrap = hasFeature('includeBootstrap');
      this.includeModernizr = hasFeature('includeModernizr');
      this.includeAnalytics = hasFeature('includeAnalytics');
      this.includeJQuery = answers.includeJQuery;
    });
  }

  writing() {
    const templateData = {
      appname: this.appname,
      date: new Date().toISOString().split('T')[0],
      name: this.pkg.name,
      version: this.pkg.version,
      includeSass: this.includeSass,
      includeBootstrap: this.includeBootstrap,
      testFramework: this.options['test-framework'],
      includeJQuery: this.includeJQuery,
      includeModernizr: this.includeModernizr,
      includeAnalytics: this.includeAnalytics
    };

    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output));
    };

    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(
        this.templatePath(input),
        this.destinationPath(output),
        data
      );
    };

    // Render Files
    config.filesToRender.forEach(file => {
      copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      copy(file.input, file.output);
    });

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });

    if (this.includeModernizr) {
      copy('modernizr.json', 'modernizr.json');
    }

    let cssFile = `main.${this.includeSass ? 'scss' : 'css'}`;
    copyTpl(cssFile, `app/styles/${cssFile}`, templateData);
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
