const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('general', () => {
  before(done => {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({features: []})
      .withGenerators([
        [helpers.createDummyGenerator(), 'mocha:app']
      ])
      .on('end', done);
  });

  it('the generator can be required without throwing', () => {
    // not testing the actual run of generators yet
    require('../app');
  });

  it('creates expected files', () => {
    assert.file([
      'bower.json',
      'package.json',
      'gulpfile.js',
      '.babelrc',
      '.editorconfig',
      '.bowerrc',
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
});
