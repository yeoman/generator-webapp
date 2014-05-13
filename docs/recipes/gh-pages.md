# Deploying to GitHub Pages (gh-pages)

Deploying using `git subtree` allows for clean use of GitHubs gh-pages. Your `gh-pages` branch will contain the files from `dist`.

## Steps

### 1. Prerequisits
- install `git subtree` if not available ([guide](http://engineeredweb.com/blog/how-to-install-git-subtree/))
- your generated webapp is in a git repository with GitHub as origin remote


### 2. Install the [gulp-subtree](https://github.com/Snugug/gulp-subtree) plugin

```sh
$ npm install --save-dev gulp-subtree
```

### 3. Create a `deploy` task

This create a new build, pushes it to the `gh-pages` branch and cleans the build afterwards

```js
gulp.task('deploy', ['build'], function () {
    return gulp.src('dist')
        .pipe($.subtree())
        .pipe($.clean()); 
});
```

### 4. Remove `dist` folder from `.gitignore`   

```diff
node_modules
-dist
.tmp
.sass-cache
bower_components
test/bower_components
```


## Usage

- run `gulp deploy` to deploy `dist` to `gh-pages` branch
- visit `http://[your-username].github.io/[repo-name]/` to see your website   

### Note
Give it a couple of minutes for your page to show up — there will be a delay this very first time. In the future, changes will show up pretty much instantly.

### Extra
- see [gulp-subtree](https://github.com/Snugug/gulp-subtree) for details on changing branch and commit message 
- see GitHub documentation on [Pages](https://pages.github.com/) for features such as custom domains
