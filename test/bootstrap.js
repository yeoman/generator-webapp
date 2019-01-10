const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Bootstrap feature', () => {
  describe('on', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ features: ['includeBootstrap'] })
        .on('end', done);
    });

    it('should add jQuery and Popper.js as dependencies', () => {
      assert.fileContent('package.json', '"jquery": "');
      assert.fileContent('package.json', '"popper.js": "');
    });

    it('should enable jQuery environment in ESLint', () => {
      assert.fileContent('package.json', '"jquery": true');
    });
  });

  describe('off', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: false
        })
        .on('end', done);
    });

    it('should not contain jQuery or Popper.js', () => {
      assert.noFileContent('package.json', '"jquery": "');
      assert.noFileContent('package.json', '"popper.js": "');
    });
  });

  // Bootstrap 4
  describe('with Sass', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          features: ['includeSass', 'includeBootstrap']
        })
        .on('end', done);
    });

    it('should use Bootstrap', () => {
      assert.fileContent('package.json', '"bootstrap"');
    });

    it('should output the correct <script> paths', () => {
      assert.fileContent(
        'app/index.html',
        '/node_modules/bootstrap/dist/js/bootstrap.min.js'
      );
    });

    it('should apply rem units in scss', () => {
      assert.fileContent('app/styles/main.scss', '1.5rem');
      assert.fileContent('app/styles/main.scss', '(min-width: 48em)');
    });
  });

  // Bootstrap 4
  describe('without Sass', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          features: ['includeBootstrap']
        })
        .on('end', done);
    });

    it('should use Bootstrap', () => {
      assert.fileContent('package.json', '"bootstrap"');
    });

    it('should output the correct <script> paths', () => {
      assert.fileContent(
        'app/index.html',
        '/node_modules/bootstrap/dist/js/bootstrap.min.js'
      );
    });

    it('should apply rem units in css', () => {
      assert.fileContent('app/styles/main.css', '1.5rem');
      assert.fileContent('app/styles/main.css', '(min-width: 48em)');
    });
  });
});
