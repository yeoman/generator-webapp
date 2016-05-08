'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('test framework', function () {
  describe('mocha', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({'test-framework': 'mocha'})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('uses the correct ESLint environment', function () {
      assert.fileContent('gulpfile.js', 'mocha: true');
    });

    it('generates the expected fixture', function () {
      assert.fileContent('test/index.html', 'mocha');
    });
  });

  describe('jasmine', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({'test-framework': 'jasmine'})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('uses the correct ESLint environment', function () {
      assert.fileContent('gulpfile.js', 'jasmine: true');
    });

    it('generates the expected fixture', function () {
      assert.fileContent('test/index.html', 'jasmine');
    });
  });
});
