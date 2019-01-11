# AWS S3 Deployment

This recipe demonstrates how to set up AWS S3 deployment task.


## Steps

### 1. Install dependencies

Install the [gulp-awspublish](https://github.com/pgherveou/gulp-awspublish) gulp plugin:

```
$ npm install --save-dev gulp-awspublish
```

### 2. Create a `deploy` task

Add this task to your `gulpfile.js`. It will run `build` task before deploying:

```js
gulp.task('deploy', ['default'], () => {
  // create a new publisher
  const publisher = $.awspublish.create({
    params: {
      'Bucket': '...'
    }
  });

  // define custom headers
  const headers = {
    'Cache-Control': 'max-age=315360000, no-transform, public'
  };

  return gulp.src('dist/**/*.*')
    .pipe(publisher.publish(headers))
    .pipe(publisher.sync())
    .pipe(publisher.cache())
    .pipe($.awspublish.reporter());
});
```

### 3. Add cache file to `.gitignore`.

```
.awspublish-*
```

`publisher.cache()` creates a through stream that creates or updates a cache file using file s3 path and file etag. Consecutive runs of publish will use this file to avoid reuploading identical files.

### 4. Deploy

Run the following command to deploy:

```
$ gulp deploy
```

###  Tip

It is highly recommended to enable [asset revisioning](asset-revisioning.md).
