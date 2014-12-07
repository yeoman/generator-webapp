# Recipes

- [CoffeeScript](coffeescript.md)
- [Handlebars](handlebars.md)
- [Less](less.md)
- [Jade](jade.md)
- [GitHub Pages](gh-pages.md)
- [Asset revisioning](asset-revisioning.md)
- [React](react.md)
- [Nunjucks](nunjucks.md)
- [AWS S3 deployment](aws-s3-deployment.md)


-

*We welcome additional recipes for common use-cases not covered by this generator.*

## Tips for writing a recipe

### 1. Use the `master` branch of the generator

If you haven't already, clone the generator and link it:

```sh
$ git clone https://github.com/yeoman/generator-gulp-webapp
$ cd generator-gulp-webapp
$ npm link
$ cd ../
```

Now the `yo gulp-webapp` command will use that version of the generator. To make sure this is actually true:

```sh
$ npm ls -g generator-gulp-webapp
# you should get something like
/usr/local/lib
└── generator-gulp-webapp@0.1.0  -> /Users/username/generator-gulp-webapp
```

To update the generator, all you need to do is:

```sh
$ cd generator-gulp-webapp
$ git pull origin master
$ cd ../
```

### 2. Create a test project

Writing a recipe without actually testing it is very hard and error-prone, you should create a test project. Let's say you're writing a recipe for [Stylus](http://learnboost.github.io/stylus/):

```sh
$ mkdir recipe-stylus && cd $_
$ yo gulp-webapp
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
