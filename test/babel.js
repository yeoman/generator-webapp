'use strict';
var path = require('path');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');

describe('Babel feature', function () {
  describe('on', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({babel: true})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('should add dependencies', function () {
      assert.fileContent('package.json', '"gulp-babel"');
      assert.fileContent('package.json', '"gulp-plumber"');
    });

    it('should use the ES6 ESLint environment', function () {
      assert.fileContent('package.json', '"es6": true');
    });

    it('should add the scripts task', function () {
      assert.fileContent('gulpfile.js', "gulp.task('scripts'");
      assert.fileContent('gulpfile.js', "['styles', 'scripts']");
      assert.fileContent('gulpfile.js', "['styles', 'scripts', 'fonts']");
      assert.fileContent('gulpfile.js', "gulp.watch('app/scripts/**/*.js', ['scripts'])");
      assert.fileContent('gulpfile.js', "'/scripts': '.tmp/scripts',");
    });
  });

  describe('off', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({babel: false})
        .withPrompts({features: []})
        .on('end', done);
    });

    it('shouldn\'t add dependencies', function () {
      assert.noFileContent('package.json', '"gulp-babel"');
      assert.noFileContent('package.json', '"gulp-plumber"');
    });

    it('shouldn\'t use the ES6 ESLint environment', function () {
      assert.noFileContent('package.json', '"es6": true');
    });

    it('shouldn\'t add the scripts task', function () {
      assert.noFileContent('gulpfile.js', "gulp.task('scripts'");
      assert.fileContent('gulpfile.js', "['styles']");
      assert.fileContent('gulpfile.js', "['styles', 'fonts']");
      assert.fileContent('gulpfile.js', "'app/scripts/**/*.js',");
      assert.noFileContent('gulpfile.js', "gulp.watch('app/scripts/**/*.js', ['scripts'])");
      assert.fileContent('gulpfile.js', "'/scripts': 'app/scripts',");
    });
  });
});
