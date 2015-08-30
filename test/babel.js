'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('babel', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, '.tmp'))
      .withOptions({'skip-install': true, babel: true})
      .withPrompts({features: []})
      .on('end', done);
  });

  it('adds the Grunt plugin', function () {
    assert.fileContent('package.json', 'babel');
  });

  it('adds the es6 eslint env', function () {
    assert.fileContent('package.json', '"es6": true');
  });

  it('adds the Grunt task', function () {
    assert.fileContent('Gruntfile.js', 'babel');
  });
});
