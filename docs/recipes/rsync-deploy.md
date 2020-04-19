# Rsync Deploying

This is an easy way publish your site with [rsync](https://rsync.samba.org/) to serve the generated static files.

## Steps

### 1. Install dependencies

Install the [gulp-rsync](https://github.com/jerrysu/gulp-rsync) gulp plugin:

```
$ npm install --save-dev gulp-rsync
```

### 2. Create a `rsync config` file

Add a file to project root `rsync.json`.

```json
{
  "hostname": "hostname or ip",
  "username": "username",
  "destination": "folder"
}
```

For example:
```json
{
  "hostname": "example.com",
  "username": "user1",
  "destination": "/home/httpd/website"
}
```

### 3. Create a `deploy` task

Add this task to your `gulpfile.js`. It will run `build` task before deploying:

```js
function rsync() {
  const rsyncConfig = require('./rsync.json');

  return src('dist/**')
    .pipe($.rsync({
      root: 'dist',
      hostname: rsyncConfig.hostname,
      username: rsyncConfig.username,
      destination: rsyncConfig.destination,
      progress: true
  }));
});

const deploy = series(build, rsync);

exports.deploy = deploy;
```

### 4. Deploy

Run the following command to deploy:

```
$ gulp deploy
```

### Tips

It is highly recommended to enable [asset revisioning](asset-revisioning.md).

You can add `rsync.json` file to `.gitignore` to protect your connection data.
```
/rsync.json
```
