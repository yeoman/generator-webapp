'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('gulp tasks', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .on('end', done);
  });

  it('should contain necessary tasks', function () {
    [
      'styles',
      'lint',
      'lint:test',
      'html',
      'images',
      'fonts',
      'extras',
      'clean',
      'serve',
      'serve:dist',
      'serve:test',
      'wiredep',
      'build',
      'default'
    ].forEach(function (task) {
      assert.fileContent('gulpfile.js', 'gulp.task(\'' + task);
    });
  });
});
