'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('slug name', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, 'temp'))
      .withOptions({'skip-install': true})
      .withPrompts({features: []})
      .on('end', done)
  });

  it('should generate the same appname in every file', function () {
    var expectedAppName = 'temp';

    assert.fileContent('bower.json', '"name": "temp"');
    assert.fileContent('app/index.html', '<title>temp</title>');
  });
});
