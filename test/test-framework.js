const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('test framework', () => {
  describe('mocha', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({'test-framework': 'mocha'})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('generates the expected fixture', () => {
      assert.fileContent('test/index.html', 'mocha');
    });
  });

  describe('jasmine', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({'test-framework': 'jasmine'})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('generates the expected fixture', () => {
      assert.fileContent('test/index.html', 'jasmine');
    });
  });
});
