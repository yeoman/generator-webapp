'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Sass feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: [
          'includeSass'
        ]})
        .on('end', done);
    });

    it('should add dependencies', function () {
      assert.fileContent('package.json', '"gulp-sass"');
      assert.fileContent('package.json', '"gulp-plumber"');
    });

    it('should create an SCSS file', function () {
      assert.file('app/styles/main.scss');
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({'babel': false})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('shouldn\'t add dependencies', function () {
      assert.noFileContent('package.json', '"gulp-sass"');
      assert.noFileContent('package.json', '"gulp-plumber"');
    });

    it('should create a CSS file', function () {
      assert.file('app/styles/main.css');
    });
  });
});
