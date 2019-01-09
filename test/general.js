const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('general', () => {
  before(done => {
    helpers
      .run(path.join(__dirname, '../app'))
      .withPrompts({ features: [] })
      .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']])
      .on('end', done);
  });

  it('the generator can be required without throwing', () => {
    // not testing the actual run of generators yet
    require('../app');
  });

  it('creates expected files', () => {
    assert.file([
      'package.json',
      'gulpfile.babel.js',
      '.babelrc',
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'app/favicon.ico',
      'app/apple-touch-icon.png',
      'app/robots.txt',
      'app/index.html',
      'app/scripts/main.js',
      'app/styles/main.css',
      'app/images',
      'app/fonts',
      'test'
    ]);
  });

  it('creates expected tasks', () => {
    assert.fileContent('package.json', 'serve:test');
    assert.fileContent('package.json', 'serve:dist');
    assert.fileContent('package.json', 'start');
    assert.fileContent('package.json', 'build');
    assert.fileContent('package.json', 'test');
  });
});
