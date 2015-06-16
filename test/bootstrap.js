'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('Bootstrap feature', function () {
  describe('with Sass', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true})
        .withPrompts({features: [
          'includeSass',
          'includeBootstrap'
        ]})
        .on('end', done);
    });

    it('should add the correct dependencies', function () {
      assert.fileContent('bower.json', '"bootstrap-sass"');
      assert.noFileContent('bower.json', '"jquery"');
    });

    it('should output the correct <script> paths', function () {
      assert.fileContent('app/index.html', '/bootstrap-sass/assets/javascripts/bootstrap/');
    });

    it('should contain the font icon path variable', function () {
      assert.fileContent('app/styles/main.scss', '$icon-font-path');
    });
  });

  describe('without Sass', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true})
        .withPrompts({features: [
          'includeBootstrap'
        ]})
        .on('end', done);
    });

    it('should add the correct dependencies', function () {
      assert.fileContent('bower.json', '"bootstrap"');
      assert.noFileContent('bower.json', '"jquery"');
    });

    it('should output the correct <script> paths', function () {
      assert.fileContent('app/index.html', '/bootstrap/js/');
    });
  });
});
