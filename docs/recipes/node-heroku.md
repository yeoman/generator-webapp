# Deploying to Heroku using Node.js

This is an easy way publish your site on Heroku using Node.js to serve the generated static files.

## Steps

### 1. Set dist/public as dist target

In your gulpfile, change the distribution directory to dist/public, do not rename the taskname. [Example](https://gist.github.com/gaboesquivel/b71d153475141a8f1c61). Also update your `.gitignore` file.

### 2. Create dist/server.js

```js
const express = require('express');
const serveStatic = require('serve-static');
const compression = require('compression');
const port = process.env.PORT || 3000;
const domain =  process.env.DOMAIN;

function ensureDomain(req, res, next) {
  if (!domain || req.hostname === domain) {
    // OK, continue
    return next();
  };

  // handle port numbers if you need non defaults
  res.redirect(`http://${domain}${req.url}`);
};

const app = express();

// at top of routing calls
app.all('*', ensureDomain);

app.use(compression());

// default to .html (you can omit the extension in the URL)
app.use(serveStatic(`${__dirname}/public`, {'extensions': ['html']}));

app.listen(port, () => {
  console.log('Server running...');
});
```

### 3. Create dist/package.json

```json
{
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines":{
    "node": ">=4"
  },
  "dependencies": {
    "compression": "^1.4.4",
    "express": "^4.12.3",
    "serve-static": "^1.9.2"
  }
}
```

### 4. Push the dist folder to Heroku

Use the [Heroku Toolbelt](https://github.com/heroku/heroku) to create an app and push your `dist` folder to Heroku.

That's it!
