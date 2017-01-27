# Adding Compass

In this mini-recipe you'll learn how to add Compass to your project.

## Steps

### 1. Install [compass](http://compass-style.org/install/) and [compass-importer](https://github.com/haithembelhaj/compass-importer)

Because Compass is a Ruby gem, we need a special importer to include it with node-sass. Install the following dependencies:

```
$ gem install compass
$ npm install --save-dev compass-importer
```

### 2. Pass compass-importer to gulp-sass

Now we need to add compass-importer to node-sass by passing it to gulp-sass options in the `styles` task:

```diff
+const compass = require('compass-importer');

 gulp.task('styles', () => {
   return gulp.src('app/styles/*.scss')
     .pipe($.plumber())
     .pipe($.sourcemaps.init())
     .pipe($.sass.sync({
       outputStyle: 'expanded',
       precision: 10,
-      includePaths: ['.']
+      includePaths: ['.'],
+      importer: compass
     }).on('error', $.sass.logError))
     .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
     .pipe($.sourcemaps.write())
     .pipe(gulp.dest('.tmp/styles'))
     .pipe(reload({stream: true}));
 });
```

### 3. Verify that it works

To verify that Compass is indeed available, let's import it into `main.scss` and check if it works:

```scss
@import 'compass';

body {
  @include baseline-grid-background;
}
```

Now your page should have a visible baseline grid, which is helpful for maintaining a vertical rhythm.

## Caveats

compass-importer uses [compass-mixins](https://github.com/Igosuki/compass-mixins), which is not 100% feature-complete at the time of this writing. For example, there is a [known issue](https://github.com/Igosuki/compass-mixins/issues/36) with the `font-face` mixin.
