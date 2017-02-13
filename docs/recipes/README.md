# Recipes

- [CoffeeScript](coffeescript.md)
- [Handlebars](handlebars.md)
- [Less](less.md)
- [Stylus](stylus.md)
- [Compass](compass.md)
- [Pug](pug.md)
- [GitHub Pages](gh-pages.md)
- [Asset revisioning](asset-revisioning.md)
- [React](react.md)
- [React Router](react-router.md)
- [Nunjucks](nunjucks.md)
- [AWS S3 deployment](aws-s3-deployment.md)
- [Heroku deployment - Node.js](node-heroku.md)
- [Rsync deployment](rsync-deploy.md)
- [Browserify](browserify.md)
- [HTMLHint](htmlhint.md)
- [Liquify](liquify.md)

*We welcome additional recipes for common use-cases not covered by this generator.*

## Tips for writing a recipe

### 1. Use the `master` branch of the generator

If you haven't already, clone the generator and link it:

```sh
$ git clone https://github.com/yeoman/generator-webapp
$ cd generator-webapp
$ npm link
$ cd ../
```

Now the `yo webapp` command will use that version of the generator. To make sure this is actually true:

```sh
$ npm ls -g generator-webapp
# you should get something like
/usr/local/lib
└── generator-webapp@0.1.0  -> /Users/username/generator-webapp
```

To update the generator, all you need to do is:

```sh
$ cd generator-webapp
$ git pull origin master
$ cd ../
```

### 2. Create a test project

Writing a recipe without actually testing it is very hard and error-prone, you should create a test project. Let's say you're writing a recipe for [Stylus](http://learnboost.github.io/stylus/):

```sh
$ mkdir recipe-stylus && cd $_
$ yo webapp
# select all options
```

### 3. Track changes

You should now create a Git repository and commit everything, this will allow you to see exactly which changes are required to implement Stylus:

```sh
$ git init
$ git add .
$ git commit -m "Initial commit"
```

### 4. Get your feature working

Do whatever is necessary to get Stylus working, install required gulp plugins, change `gulpfile.js`, update styles etc.

### 5. Write the recipe

After you've completed a minimal set of changes to implement Stylus, run `git diff` and use the output to write the recipe.
