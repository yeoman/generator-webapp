# Deploying to GitHub Pages

In this recipe you will learn how to set up deployment to [GitHub Pages](https://pages.github.com). Your `gh-pages` branch will contain files from `dist`.


## Steps

### 1. Install [gulp-gh-pages](https://github.com/shinnn/gulp-gh-pages)

We only need to install one dependency for this recipe:

```
$ npm install --save-dev gulp-gh-pages
```

### 2. Create a `deploy` task

We need to create a `deploy` task, which will deploy contents of `dist` to the remote `gh-pages` branch:

```js
gulp.task('deploy', ['default'], () => {
  return gulp.src('dist/**/*')
    .pipe($.ghPages());
});
```

If you don't want to trigger a rebuild on each `gulp deploy`, feel free to remove the `['default']` part.

Also, cache from this plugin will be saved to `.publish`, we can ignore it by adding this line to `.gitignore`:

```
.publish
```

### 3. Ensure that your repository is on GitHub and that `origin` is set

For gulp-gh-pages to work, we need to have our repository on GitHub, and the `origin` remote has to point there. We can check our remotes by running:

```
$ git remote -v
```

If `origin` doesn't exist, create it:

```
$ git remote add origin https://github.com/you/webapp.git
```
Not sure which URL to use? Check out "[Which remote URL should I use?](https://help.github.com/articles/which-remote-url-should-i-use/)"

Our app will be hosted on the `gh-pages` branch, so we need to have it on the remote repository. We can create an [orphan branch](http://stackoverflow.com/a/4288660/1247274) by running:

```
$ git checkout --orphan gh-pages
```

In order to be able to push this branch, we have to have at least one commit, so let's create an empty one:

```
$ git commit -m "Initial commit" --allow-empty
```

Now we can push it to `origin`:

```
$ git push origin gh-pages
```

## Usage

1. Run `gulp deploy`.
2. Visit `http://[your-username].github.io/[repo-name]`.

It might take a couple of minutes for your page to show up the first time you push to `gh-pages`.

## Troubleshooting

In case your `gulp deploy` command is failing, try deleting the cache by running:

```
$ rm -rf .publish
```

and trying again.
