# Adding Compass

This recipe demonstrates how to add [Compass](http://compass-style.org/) to your
existing Sass setup.

## Steps

### 1. Install dependencies

Install the Compass Ruby gem and the grunt plugin:

```sh
gem install compass
npm install --save-dev grunt-contrib-compass
```

**Note**: `gem install`ing is global, so it doesn't matter where you're running the command from, but `npm install` should be run from inside the project directory.

### 2. Replace the `sass` task with `compass`

Replace:

```js
sass: {
  options: {
    loadPath: 'bower_components'
  },
  dist: {
    files: [{
      expand: true,
      cwd: '<%= config.app %>/styles',
      src: ['*.{scss,sass}'],
      dest: '.tmp/styles',
      ext: '.css'
    }]
  },
  server: {
    files: [{
      expand: true,
      cwd: '<%= config.app %>/styles',
      src: ['*.{scss,sass}'],
      dest: '.tmp/styles',
      ext: '.css'
    }]
  }
},
```

with:

```js
compass: {
  options: {
    sassDir: '<%= config.app %>/styles',
    cssDir: '.tmp/styles',
    imagesDir: '<%= config.app %>/images',
    javascriptsDir: '<%= config.app %>/scripts',
    fontsDir: '<%= config.app %>/styles/fonts',
    generatedImagesDir: '.tmp/images/generated',
    importPath: 'bower_components',
    httpImagesPath: '../images',
    httpGeneratedImagesPath: '../images/generated',
    httpFontsPath: 'fonts',
    relativeAssets: false,
    assetCacheBuster: false
  },
  dist: {
    options: {
      generatedImagesDir: '<%= config.dist %>/images/generated'
    }
  },
  server: {
    options: {
      debugInfo: true
    }
  }
},
```

* Now you can use asset functions like `font-url()` and `image-url()` in your Sass.
* This solution uses relative paths, but you can edit values of `http*` options to absolute paths, just make sure not to break grunt-usemin.

### 3. Update other tasks

#### `watch`

```diff
-sass: {
+compass: {
   files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
-  tasks: ['sass:server', 'autoprefixer']
+  tasks: ['compass:server', 'autoprefixer']
 },
```

#### `concurrent`

```diff
 concurrent: {
   server: [
-    'sass:server',
+    'compass:server',
     'copy:styles'
   ],
   test: [
     'copy:styles'
   ],
   dist: [
-    'sass',
+    'compass',
     'copy:styles',
     'imagemin',
     'svgmin'
   ]
 }
```

### 4. Use Compass features

No `@import "compass"` needed.
