## Bower components

We moved `bower_components` to the project root, read [this post](http://yeoman.io/blog/bower_components-in-project-root.html) if you're curious why. In order for that to work, we had to make some accommodations. If you've ever had struggles with it, this should clear things up.

Basically:

* paths in Sass `@import` directives should begin with `bower_components`
* paths in HTML should begin with `/bower_components`

Both paths will work regardless of the nesting level, e.g. they would work on a `about/contact/index.html` page too.

Details:

* we serve `bower_components` as if it is located in `app`
* we add the project root to Sass load path in order for `@import "bower_components/..."` directives to work
* we strip all the `../`s from the beginning of `bower_components` paths
* we add the project root to [gulp-useref](https://github.com/jonkemp/gulp-useref)'s search path in order for the build step to work
