const path = require('path');
const helpers = require('yeoman-test');
//const assert = require('yeoman-assert');

describe.skip('Test handler', () => {
  describe('When user refused unit and e2e tests directly', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: false })
        .on('end', done);
    });

    it('Should not add unit tests', () => {
      //@TODO
    });

    it('Should not add e2e tests', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to add test but avoid to pick unit and e2e test', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: true, testsWanted: [] })
        .on('end', done);
    });

    it('Should not add any unit tests', () => {
      //@TODO
    });

    it('Should not add e2e tests', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to test only e2e', () => {
    before(done => {
      helpers
        .run(path.join(__dirname, '../app'))
        .withPrompts({ includeTest: true, testsWanted: [] })
        .on('end', done);
    });

    it('Should not add any unit tests', () => {
      //@TODO
    });

    it('Should add e2e tests', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to e2e testing add Unit Testing (Ava)', () => {
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
      //@TODO
    });

    it('Should add unit tests for Ava', () => {
      //@TODO
    });

    it('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to add only Unit Testing (Jest)', () => {
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
      //@TODO
    });

    it('Should add unit tests for Jest', () => {
      //@TODO
    });

    it('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to add only Unit Testing (Jasmine)', () => {
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
      //@TODO
    });

    it('Should add unit tests for Jasmine', () => {
      //@TODO
    });

    it('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to add only Unit Testing for Mocha (TDD)', () => {
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
      //@TODO
    });

    it('Should add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it('Should not add unit tests for Ava', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (BDD)', () => {
      //@TODO
    });
  });

  describe.skip('When user agrees to add only Unit Testing for Mocha (BDD)', () => {
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
      //@TODO
    });

    it('Should add unit tests for Mocha (BDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Mocha (TDD)', () => {
      //@TODO
    });

    it('Should not add unit tests for Jasmine', () => {
      //@TODO
    });

    it('Should not add unit tests for Jest', () => {
      //@TODO
    });

    it('Should not add unit tests for Ava', () => {
      //@TODO
    });
  });
});
