/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Gulp webapp generator: sass feature', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'sass'), function (err) {
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

  var assertFileExists = function (app, fileExt, features, done) {
    var expected = [
      'app/styles/main.' + fileExt
    ];

    helpers.mockPrompt(app, {
      features: features
    });

    app.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  };

  it('should create scss file', function (done) {
    assertFileExists(this.webapp, 'scss', ['includeSass'], done);
  });

  it('should create css file', function (done) {
    assertFileExists(this.webapp, 'css', [], done);
  });
});
