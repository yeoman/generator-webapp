# Frequently Asked Questions

## Add templating engine X?

There are a **lot** of templating languages: Pug, Swig, pure.js, Nunjucks, Underscore, Mustache etc. We don't believe there is a single right choice, it depends on the situation and desired complexity, so we chose not to have a built-in templating solution. However, we have [recipes](recipes) for implementing some of them, so you can use them as references.

## Organize paths into variables?

While we understand that this is often useful as the scaffolded project grows, we believe it's a premature optimization in this case. If you're changing the project structure, most of the times a simple find & replace does the trick. Also, this feature is not very straightforward, it's not obvious what should be a variable and what shouldn't, so we think it's best to leave this one up to you. Read the whole discussion in [#295](https://github.com/yeoman/generator-webapp/issues/295).
