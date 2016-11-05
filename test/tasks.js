const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('gulp tasks', () => {
  before(done => {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .on('end', done);
  });

  it('should contain necessary tasks', () => {
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
    ].forEach((task) => {
      assert.fileContent('gulpfile.js', 'gulp.task(\'' + task);
    });
  });
});
