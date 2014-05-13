/*global describe, beforeEach, it*/

var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;

describe('Webapp generator test', function () {
  var expectedContent = [
    ['bower.json', /"name": "temp"/],
    ['package.json', /"name": "temp"/]
  ];
  var expected = [
    'Gruntfile.js',
    'app/404.html',
    'app/favicon.ico',
    'app/robots.txt',
    'app/index.html',
    'app/styles/main.scss'
  ];

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
      ], null, {
        'skip-install': true,
        'skip-welcome-message': true,
        'skip-message': true
      });

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
  });

  it('creates expected CoffeeScript files', function (done) {
    helpers.mockPrompt(this.webapp, {
      features: ['includeSass']
    });

    this.webapp.coffee = true;
    this.webapp.run({}, function () {
      helpers.assertFile([].concat(expected, ['app/scripts/main.coffee']));
      assert.fileContent([].concat(
        expectedContent,
        [['Gruntfile.js', /coffee/]]
      ));
      done();
    });
  });

  it('creates expected files in non-coffee mode', function (done) {
    helpers.mockPrompt(this.webapp, {
      features: ['includeSass']
    });

    this.webapp.coffee = false;
    this.webapp.run({}, function () {
      helpers.assertFile([].concat(expected, ['app/scripts/main.js']));
      assert.noFileContent('Gruntfile.js', /coffee/);
      done();
    });
  });
});
