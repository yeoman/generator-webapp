'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Bootstrap feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: [
          'includeBootstrap'
        ]})
        .on('end', done);
    });

    it('shouldn\'t add jQuery explicitly as a dependency', function () {
      assert.noFileContent('bower.json', '"jquery"');
    });

    it('should add the comment block', function () {
      assert.fileContent('app/index.html', 'build:js scripts/plugins.js')
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: []})
        .on('end', done);
    });

    it('should add jQuery explicitly as a dependency', function () {
      assert.fileContent('bower.json', '"jquery"');
    });

    it('shouldn\'t add the comment block', function () {
      assert.noFileContent('app/index.html', 'build:js scripts/plugins.js')
    });
  });

  describe('with Sass', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: [
          'includeSass',
          'includeBootstrap'
        ]})
        .on('end', done);
    });

    it('should use Bootstrap Sass', function () {
      assert.fileContent('bower.json', '"bootstrap-sass"');
    });

    it('should output the correct <script> paths', function () {
      assert.fileContent('app/index.html', /src=\"(.*?)\/bootstrap-sass\/assets\/javascripts\/bootstrap\//);
    });

    it('should contain the font icon path variable', function () {
      assert.fileContent('app/styles/main.scss', '$icon-font-path');
    });

    it('should correctly override bootstrap\'s bower.json', function() {
      assert.fileContent('bower.json', '"overrides"');

      assert.fileContent('bower.json', 'assets/stylesheets/_bootstrap.scss');

      assert.fileContent('bower.json', 'assets/fonts/bootstrap/*');

      assert.fileContent('bower.json', 'assets/javascripts/bootstrap.js');
    });
  });

  describe('without Sass', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: [
          'includeBootstrap'
        ]})
        .on('end', done);
    });

    it('should use Bootstrap', function () {
      assert.fileContent('bower.json', '"bootstrap"');
    });

    it('should output the correct <script> paths', function () {
      assert.fileContent('app/index.html', /src=\"(.*?)\/bootstrap\/js\//);
    });

    it('should correctly override bootstrap\'s bower.json', function() {
      assert.fileContent('bower.json', '"overrides"');

      assert.fileContent('bower.json', 'less/bootstrap.less');

      assert.fileContent('bower.json', 'dist/css/bootstrap.css');

      assert.fileContent('bower.json', 'dist/js/bootstrap.js');

      assert.fileContent('bower.json', 'dist/fonts/*');
    });
  });
});
