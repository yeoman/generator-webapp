const path = require('path');
const helpers = require('yeoman-test');
const assert = require('yeoman-assert');

function unitPresent() {
  assert.fileContent('app/index.html', 'type="module" src="scripts/main.js"');
  assert.fileContent('app/scripts/main.js', 'export function greeting');
  assert.fileContent('package.json', '"test:unit": "');
}

function unitNotPresent() {
  assert.noFileContent('app/index.html', 'type="module" src="scripts/main.js"');
  assert.noFileContent('app/scripts/main.js', 'export function greeting');
  assert.noFileContent('package.json', '"test:unit": "');
}

function e2ePresent() {
  assert.fileContent('package.json', '"cypress": "');
  assert.fileContent('package.json', '"start-server-and-test": "');
  assert.fileContent('package.json', '"test:e2e-open": "');
  assert.fileContent('package.json', '"test:e2e": "');
}

function e2eNotPresent() {
  assert.noFileContent('package.json', '"cypress": "');
  assert.noFileContent('package.json', '"start-server-and-test": "');
  assert.noFileContent('package.json', '"test:e2e-open": "');
  assert.noFileContent('package.json', '"test:e2e": "');
}

describe('Test handler', () => {
  describe('When user refused unit and e2e tests directly', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: false })
        .on('end', done);
    });

    it.skip('Should not add unit tests', () => {
      unitNotPresent();
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });
  });

  describe('When user agrees to add test but avoid to pick unit and e2e test', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: true, testsWanted: [] })
        .on('end', done);
    });

    it.skip('Should not add any unit tests', () => {
      unitNotPresent();
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });
  });

  describe('When user agrees to test only e2e', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: true, testsWanted: ['includeE2e'] })
        .on('end', done);
    });

    it.skip('Should not add any unit tests', () => {
      unitNotPresent();
    });

    it('Should add e2e tests', () => {
      e2ePresent();
    });
  });

  describe('When user agrees to e2e testing add Unit Testing (Ava)', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          includeTest: true,
          testsWanted: ['includeE2e', 'includeUnit'],
          unitTestFramework: 'ava'
        })
        .on('end', done);
    });

    it('Should add e2e tests', () => {
      e2ePresent();
    });

    it.skip('Should add unit tests Basics', () => {
      unitPresent();
    });

    it.skip('Should add unit tests for Ava', () => {
      unitPresent();
      //@TODO
    });

    it.skip('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe('When user agrees to add only Unit Testing (Jest)', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          includeTest: true,
          testsWanted: ['includeUnit'],
          unitTestFramework: 'jest'
        })
        .on('end', done);
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });

    it.skip('Should add unit tests Basics', () => {
      unitPresent();
    });

    it.skip('Should add unit tests for Jest', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe('When user agrees to add only Unit Testing (Jasmine)', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          includeTest: true,
          testsWanted: ['includeUnit'],
          unitTestFramework: 'jasmine'
        })
        .on('end', done);
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });

    it.skip('Should add unit tests Basics', () => {
      unitPresent();
    });

    it.skip('Should add unit tests for Jasmine', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe('When user agrees to add only Unit Testing for Mocha (TDD)', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          includeTest: true,
          testsWanted: ['includeUnit'],
          unitTestFramework: 'mochaTdd'
        })
        .on('end', done);
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });

    it.skip('Should add unit tests Basics', () => {
      unitPresent();
    });

    it.skip('Should add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe('When user agrees to add only Unit Testing for Mocha (BDD)', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({
          includeTest: true,
          testsWanted: ['includeUnit'],
          unitTestFramework: 'mochaBdd'
        })
        .on('end', done);
    });

    it('Should not add e2e tests', () => {
      e2eNotPresent();
    });

    it.skip('Should add unit tests Basics', () => {
      unitPresent();
    });

    it.skip('Should add unit tests for Mocha (BDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it.skip('Should not add unit tests for Ava', () => {
      //@TODO
    });
  });
});
