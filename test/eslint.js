'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('eslint', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({'skip-install': true})
      .withPrompts({features: []})
      .on('end', done);
  });

  it('adds Grunt plugin', function () {
    assert.fileContent('package.json', 'grunt-eslint');
  });

  it('adds basic configuration', function () {
    assert.fileContent('package.json', 'eslintConfig');
  });

  it('adds eslint recommended rule', function () {
    assert.fileContent('package.json', 'eslint:recommended');
  });

  it('adds Grunt task', function () {
    assert.fileContent('Gruntfile.js', 'eslint');
  });
});
