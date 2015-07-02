'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('sass', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({'skip-install': true})
      .withPrompts({features: [
        'includeSass'
      ]})
      .on('end', done);
  });

  it('uses SCSS', function () {
    assert.file('app/styles/main.scss');
    assert.noFile('app/styles/main.css');
  });

  it('adds the Grunt plugin', function () {
    assert.fileContent('package.json', 'sass');
  });

  it('adds the Grunt task', function () {
    assert.fileContent('Gruntfile.js', 'sass');
  });

  it('adds the HTML description', function () {
    assert.fileContent('app/index.html', 'Sass');
  });
});
