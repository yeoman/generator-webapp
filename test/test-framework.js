'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('test framework', function () {
  describe('mocha', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({
          'skip-install': true,
          'test-framework': 'mocha'
        })
        .withPrompts({features: []})
        .on('end', done);
    });

    it('adds the Grunt plugin', function () {
      assert.fileContent('package.json', '"grunt-mocha"');
    });

    it('adds the Grunt task', function () {
      assert.fileContent('Gruntfile.js', 'mocha');
    });

    it('uses the ESLint environment', function () {
      assert.fileContent('package.json', '"mocha"');
    });
  });

  describe('jasmine', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withOptions({
          'skip-install': true,
          'test-framework': 'jasmine'
        })
        .withPrompts({features: []})
        .on('end', done);
    });

    it('adds the Grunt plugin', function () {
      assert.fileContent('package.json', '"grunt-contrib-jasmine"');
    });

    it('adds the Grunt task', function () {
      assert.fileContent('Gruntfile.js', 'jasmine');
    });

    it('uses the ESLint environment', function () {
      assert.fileContent('package.json', '"jasmine"');
    });
  });
});
