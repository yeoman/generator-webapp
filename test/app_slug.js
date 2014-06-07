/*global describe, beforeEach, it*/
'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;

describe('Gulp Webapp generator slug name', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'slug'), function (err) {
      if (err) {
        return done(err);
      }

      this.webapp = helpers.createGenerator('gulp-webapp:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.webapp.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('should generate the same appName in every file', function (done) {
    var expectedAppName = 'slug';
    var expected = [
      'bower.json',
      'app/index.html'
    ];
    helpers.mockPrompt(this.webapp, {
      features: ['includeSass']
    });

    this.webapp.run({}, function () {
      // Check if all files are created for the test
      helpers.assertFile(expected);

      // read JS Files
      var bowerJson = fs.readFileSync('bower.json', 'utf8');

      // Test JS Files
      var regexJs = new RegExp('"name": "' + expectedAppName + '"');
      assert.ok(regexJs.test(bowerJson), 'bower.json template using a wrong appName');

      // read HTML file
      var indexHtml = fs.readFileSync('app/index.html', 'utf8');

      // Test HTML File
      var regexHtml = new RegExp('<title>' + expectedAppName + '</title>');
      assert.ok(regexHtml.test(indexHtml), 'index.html template using a wrong appName');
      done();
    });
  });
});
