'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('jQuery feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: true
        })
        .on('end', done);
    });

    it('should add the correct dependencies', function () {
      assert.fileContent('bower.json', '"jquery"');
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: false
        })
        .on('end', done);
    });

    it('should add the correct dependencies', function () {
      assert.noFileContent('bower.json', '"jquery"');
    });
  });
});
