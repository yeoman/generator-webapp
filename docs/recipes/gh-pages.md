# Deploying to GitHub Pages

Deploying your app using `git subtree` allows the use of [GitHub Pages](https://pages.github.com). Your `gh-pages` branch will contain the files from `dist`.


## Steps

### Prerequisites

1. If not already available, [install git-subtree](http://engineeredweb.com/blog/how-to-install-git-subtree).
2. Ensure your generated app is in a GitHub-hosted repository that is set as your `origin` remote.

> You can check your remotes with `$ git remote -v`. See [Adding a remote](https://help.github.com/articles/adding-a-remote) for more info.

### 1. Install [gulp-subtree](https://github.com/Snugug/gulp-subtree)

```sh
$ npm install --save-dev gulp-subtree
```

### 2. Create a `deploy` task

This will run the build task, then push it to the `gh-pages` branch:

```js
gulp.task('deploy', ['build'], function () {
    return gulp.src('dist')
        .pipe($.subtree())
        .pipe($.clean());
});
```

### 3. Remove `dist` from `.gitignore`

```diff
 node_modules
-dist
 .tmp
 .sass-cache
 bower_components
 test/bower_components
```


## Usage

1. Run `$ gulp deploy`.
2. Visit `http://[your-username].github.io/[repo-name]`.

> It might take a couple of minutes for your page to show up the first time you push to `gh-pages`. In the future, changes will show up instantly.

### References

- See [gulp-subtree](https://github.com/Snugug/gulp-subtree) for details on changing the branch and commit message.
- See [GitHub Pages documentation](https://help.github.com/categories/20/articles) for features such as custom domains.
