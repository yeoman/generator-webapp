'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-assert');

describe('Babel feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true, babel: true})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('should add gulp-babel', function () {
      assert.fileContent('package.json', '"gulp-babel"');
    });

    it('should use the ES6 ESLint environment', function () {
      assert.fileContent('package.json', '"es6": true');
    });

    it('should add the scripts task', function () {
      assert.fileContent('gulpfile.babel.js', "gulp.task('scripts'");
      assert.fileContent('gulpfile.babel.js', "['styles', 'scripts']");
      assert.fileContent('gulpfile.babel.js', "['styles', 'scripts', 'fonts']");
      assert.fileContent('gulpfile.babel.js', "'.tmp/scripts/**/*.js',");
      assert.fileContent('gulpfile.babel.js', "gulp.watch('app/scripts/**/*.js', ['scripts'])");
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, 'temp'))
        .withOptions({'skip-install': true, babel: false})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('shouldn\'t add gulp-babel', function () {
      assert.noFileContent('package.json', '"gulp-babel"');
    });

    it('shouldn\'t use the ES6 ESLint environment', function () {
      assert.noFileContent('package.json', '"es6": true');
    });

    it('shouldn\'t add the scripts task', function () {
      assert.noFileContent('gulpfile.babel.js', "gulp.task('scripts'");
      assert.fileContent('gulpfile.babel.js', "['styles']");
      assert.fileContent('gulpfile.babel.js', "['styles', 'fonts']");
      assert.fileContent('gulpfile.babel.js', "'app/scripts/**/*.js',");
      assert.noFileContent('gulpfile.babel.js', "gulp.watch('app/scripts/**/*.js', ['scripts'])");
    });
  });
});
