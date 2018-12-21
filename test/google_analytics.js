const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Google Analytics feature', () => {
  describe('on', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ features: ['includeAnalytics'] })
        .on('end', done);
    });

    it('should add dependencies in the index.html', () => {
      assert.fileContent(
        'app/index.html',
        'https://www.google-analytics.com/analytics.js'
      );
    });
  });

  describe('off', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeModernizr: false
        })
        .on('end', done);
    });

    it("shouldn't add dependencies in the index.html", () => {
      assert.noFileContent(
        'app/index.html',
        'https://www.google-analytics.com/analytics.js'
      );
    });
  });
});
