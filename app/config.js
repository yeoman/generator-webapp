module.exports = {
  options: {
    'skip-welcome-message': {
      desc: 'Skips the welcome message',
      type: Boolean
    },
    'skip-install-message': {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    },
    'test-framework': {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    }
  },
  prompts: [
    {
      type: 'checkbox',
      name: 'features',
      message: 'Which additional features would you like to include?',
      choices: [
        {
          name: 'Sass',
          value: 'includeSass',
          checked: true
        },
        {
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        },
        {
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        },
        {
          name: 'Google Analytics',
          value: 'includeAnalytics',
          checked: true
        }
      ]
    },
    {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: true,
      when: answers =>
        answers.features && !answers.features.includes('includeBootstrap')
    },
    {
      type: 'confirm',
      name: 'includeTest',
      message: 'Would you like to add testing?',
      default: true
    },
    {
      type: 'checkbox',
      name: 'testsWanted',
      message: 'Which type of test would you like to cover?',
      when: answers => answers.includeTest,
      choices: [
        {
          name: 'End to end (e2e)',
          value: 'includeE2e',
          checked: true
        },
        {
          name: 'Unit Test',
          value: 'includeUnit',
          checked: true
        }
      ]
    },
    {
      type: 'list',
      name: 'unitTestFramework',
      message: 'Which test framework would you like to use?',
      when: answers =>
        answers.includeTest &&
        answers.testsWanted &&
        answers.testsWanted.includes('includeUnit'),
      choices: [
        {
          name: 'Jest',
          value: 'jest',
          checked: true
        },
        {
          name: 'Ava',
          value: 'ava',
          checked: true
        },
        {
          name: 'Jasmine',
          value: 'jasmine',
          checked: true
        },
        {
          name: 'Mocha (Testing driven design)',
          value: 'mochaTdd',
          checked: true
        },
        {
          name: 'Mocha (Behaviour Driven Design)',
          value: 'mochaBdd',
          checked: true
        }
      ]
    }
  ],
  dirsToCreate: ['app/images', 'app/fonts'],
  filesToCopy: [
    {
      input: 'babelrc',
      output: '.babelrc'
    },
    {
      input: 'gitignore',
      output: '.gitignore'
    },
    {
      input: 'gitattributes',
      output: '.gitattributes'
    },
    {
      input: 'editorconfig',
      output: '.editorconfig'
    },
    {
      input: 'favicon.ico',
      output: 'app/favicon.ico'
    },
    {
      input: 'apple-touch-icon.png',
      output: 'app/apple-touch-icon.png'
    },
    {
      input: 'robots.txt',
      output: 'app/robots.txt'
    }
  ],
  filesToRender: [
    {
      input: 'gulpfile.js',
      output: 'gulpfile.js'
    },
    {
      input: '_package.json',
      output: 'package.json'
    },
    {
      input: 'main.js',
      output: 'app/scripts/main.js'
    },
    {
      input: 'index.html',
      output: 'app/index.html'
    }
  ]
};
