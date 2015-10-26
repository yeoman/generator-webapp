'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('Babel feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true})
        .withPrompts({features: [
          'includeBabel'
        ]})
        .on('end', done);
    });

    it('should add the correct dependencies', function() {
      assert.fileContent('package.json', '"gulp-babel"');
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('shouldn\'t add gulp-babel explicitly as a dependency', function () {
      assert.noFileContent('package.json', '"gulp-babel"');
    });
  });
});
