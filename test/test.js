/*global describe, beforeEach, it */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Gulp webapp generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
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

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
  });

  it('creates expected files', function (done) {
    var expected = [
      'bower.json',
      'package.json',
      'gulpfile.js',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/scripts/main.js'
    ];

    helpers.mockPrompt(this.webapp, {
      features: ['includeSass']
    });

    this.webapp.run({}, function () {
      helpers.assertFile(expected);
      done();
    });
  });
});
