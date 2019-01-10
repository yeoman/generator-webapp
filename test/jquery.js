const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('jQuery feature', () => {
  describe('on', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: true
        })
        .on('end', done);
    });

    it('should add the correct dependencies', () => {
      assert.fileContent('package.json', '"jquery": "');
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

    it('should not contain jQuery', () => {
      assert.noFileContent('package.json', 'jquery');
    });
  });
});
