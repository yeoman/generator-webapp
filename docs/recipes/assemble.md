# Adding Assemble

This recipe demonstrates how to add [Assemble](http://assemble.io) to your existing setup.


## Steps

### 1. Install dependencies

Install the grunt plugin:

```
$ npm install --save-dev assemble
```


### 2. Load assemble

```diff
module.exports = function (grunt) {
+ // Load assemble.io
+ grunt.loadNpmTasks('assemble');

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);
```

### 3. Update `watch` task

```diff
// Watches files for changes and runs tasks based on the changed files
watch: {
  bower: {
    files: ['bower.json'],
    tasks: ['wiredep']
  },
  js: {
    files: ['<%= config.app %>/scripts/{,*/}*.js'],
    tasks: ['jshint'],
  },
  jstest: {
    files: ['test/spec/{,*/}*.js'],
    tasks: ['test:watch']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  sass: {
    files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
    tasks: ['sass:server', 'autoprefixer']
  },
  styles: {
    files: ['<%= config.app %>/styles/{,*/}*.css'],
    tasks: ['newer:copy:styles', 'autoprefixer']
  },
+ assemble: {
+   files: ['<%= config.app %>/templates/**/*.hbs'],
+   tasks: ['newer:assemble']
+ }
},
```

### 4. Update `livereload` task

```diff
livereload: {
  options: {
    files: [
-     '<%= config.app %>/{,*/}*.html',
+     '.tmp/*.html',
      '.tmp/styles/{,*/}*.css',
      '<%= config.app %>/images/{,*/}*',
      '<%= config.app %>/scripts/{,*/}*.js'
    ],
    port: 9000,
    server: {
      baseDir: ['.tmp', config.app],
      routes: {
        '/bower_components': './bower_components'
      }
    }
  }
}
```

### 5. Update `wiredep` task

```diff
// Automatically inject Bower components into the default handlebars template file
wiredep: {
  app: {
    ignorePath: /^\/|\.\.\//,
-   src: ['<%= config.app %>/index.html'],
+   src: ['<%= config.app %>/templates/layouts/default.hbs'],
    exclude: ['bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js']
  },
  sass: {
    src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
    ignorePath: /(\.\.\/){1,2}bower_components\//
  }
},
```

### 6. Update `useminPrepare` task

```diff
useminPrepare: {
  options: {
    dest: '<%= config.dist %>'
  },
- html: '<%= config.app %>/index.html'
+ html: '.tmp/index.html'
},
```

### 7. Update `copy` task

```diff
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
-           '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
+       }, {
+         expand: true,
+         dot: true,
+         cwd: '.tmp',
+         dest: '<%= config.dist %>',
+         src: '{,*/}*.html'
+       }, {
          expand: true,
          dot: true,
          cwd: '.',
          dest: '<%= config.dist %>',
          src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*'
        }]
      }
    },
```

### 8. Create `assemble` task

```diff
// Empties folders to start fresh
clean: {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%= config.dist %>/*',
        '!<%= config.dist %>/.git*'
      ]
    }]
  },
  server: '.tmp'
},

+ // Create html pages using assemble
+ assemble: {
+   options: {
+     flatten: true,
+     layout: '<%= config.app %>/templates/layouts/default.hbs',
+     partials: ['<%= config.app %>/templates/partials/**/*.hbs'],
+   },
+   pages: {
+     files: {
+       '.tmp/': ['<%= config.app %>/templates/pages/**/*.hbs']
+     }
+   }
+ },

// Make sure code styles are up to par and there are no obvious mistakes
jshint: {
  options: {
    jshintrc: '.jshintrc',
    reporter: require('jshint-stylish')
  },
  all: [
    'Gruntfile.js',
    '<%= config.app %>/scripts/{,*/}*.js',
    '!<%= config.app %>/scripts/vendor/*',
    'test/spec/{,*/}*.js'
  ]
},
```

### 9. Add `assemble` task to existing tasks

#### `serve`

```diff
grunt.registerTask('serve', 'start the server and preview your app', function (target) {

  if (target === 'dist') {
    return grunt.task.run(['build', 'browserSync:dist']);
  }

  grunt.task.run([
    'clean:server',
+   'assemble',
    'wiredep',
    'concurrent:server',
    'autoprefixer',
    'browserSync:livereload',
    'watch'
  ]);
});
```

#### `build`
```diff
grunt.registerTask('build', [
  'clean:dist',
+ 'assemble',
  'wiredep',
  'useminPrepare',
  'concurrent:dist',
  'autoprefixer',
  'concat',
  'cssmin',
  'uglify',
  'copy:dist',
  'modernizr',
  'filerev',
  'usemin',
  'htmlmin'
]);
```

#### `test`

```diff
grunt.registerTask('test', function (target) {
  if (target !== 'watch') {
    grunt.task.run([
      'clean:server',
+     'assemble',
      'concurrent:test',
      'autoprefixer'
    ]);
  }

  grunt.task.run([
    'browserSync:test',
    'mocha'
  ]);
});
```

### 10. Create assemble needed directories and files

```
|-- /app
|   |-- /templates
|   |   |-- /layouts
|   |   |   |-- default.hbs
|   |   |-- /pages
|   |   |   |-- index.hbs
|   |   |-- /partials
```
