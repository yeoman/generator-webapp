/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('Webapp generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.webapp = helpers.createGenerator('webapp:app', [
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
      ['bower.json', /"name": "temp"/],
      ['package.json', /"name": "temp"/],
      ['Gruntfile.js', /coffee:/],
      'app/404.html',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/scripts/main.coffee',
      'app/styles/main.scss'
    ];

    helpers.mockPrompt(this.webapp, {
      features: ['includeCompass']
    });

    this.webapp.coffee = true;
    this.webapp.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates expected files in non-AMD non-coffee mode', function (done) {
    var expected = [
      ['bower.json', /"name": "temp"/],
      ['package.json', /"name": "temp"/],
      'Gruntfile.js',
      'app/404.html',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/scripts/main.js',
      'app/styles/main.scss'
    ];

    helpers.mockPrompt(this.webapp, {
      features: ['includeCompass']
    });

    this.webapp.coffee = false;
    this.webapp.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

  it('creates expected files in AMD mode', function (done) {
    var expected = [
      ['bower.json', /"name": "temp"/],
      ['package.json', /"name": "temp"/],
      'Gruntfile.js',
      'app/404.html',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/scripts/main.js',
      'app/styles/main.scss'
    ];

    helpers.mockPrompt(this.webapp, {
      features: ['includeCompass']
    });

    this.webapp.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});
