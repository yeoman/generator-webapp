const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

describe('Modernizr feature', () => {
  describe('on', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({features: [
          'includeModernizr'
        ]})
        .on('end', done);
    });

    it('should add the correct tasks in package.json', ()=> {
        assert.fileContent('package.json', "modernizr -c modernizr.json -d app/scripts/modernizr.js");
        assert.fileContent('package.json', "npm run build:modernizr && gulp serve:test");
        assert.fileContent('package.json', "npm run build:modernizr && gulp serve:dist");
        assert.fileContent('package.json', "npm run build:modernizr && gulp serve");
    });
    
    it('should add the correct files', ()=> {
        assert.file("modernizr.json");
    });

    it('should add the correct dependencies', () => {
      assert.fileContent('package.json', 'modernizr');
    });
  });

  describe('off', () => {
    before(done => {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          features: [],
          includeModernizr: false
        })
        .on('end', done);
    });
    
    it('should add the correct tasks in package.json', ()=> {
        assert.noFileContent('package.json', "modernizr -c modernizr.json -d app/scripts/modernizr.js");
        assert.noFileContent('package.json', "npm run build:modernizr && gulp serve:test");
        assert.noFileContent('package.json', "npm run build:modernizr && gulp serve:dist");
        assert.noFileContent('package.json', "npm run build:modernizr && gulp serve"); 
    });
    
    it('should add the correct files', ()=> {
        assert.noFile("modernizr.json");
    });

    it('should add the correct dependencies', () => {
      assert.noFileContent('package.json', 'modernizr');
    });
  });
});
