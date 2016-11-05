const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('jQuery feature', () => {
  describe('on', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: true
        })
        .on('end', done);
    });

    it('should add the correct dependencies', () => {
      assert.fileContent('bower.json', '"jquery"');
    });
  });

  describe('off', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeJQuery: false
        })
        .on('end', done);
    });

    it('should add the correct dependencies', () => {
      assert.noFileContent('bower.json', '"jquery"');
    });
  });
});
