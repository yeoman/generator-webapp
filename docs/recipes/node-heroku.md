# Deploying to Heroku using Node.js

This is an easy way publish your site on heroku using Node to serve the generated static files.

## Steps

### 1. Set dist/public as dist target

In your gulpfile change distribution directory to gulp/dist, do not rename the taskname
Eg. https://gist.github.com/gaboesquivel/b71d153475141a8f1c61

Also update your `.gitignore` file.

### 2. Create dist/server.js

```js
var express = require('express')
var serveStatic = require('serve-static')
var compression = require('compression')
var port = process.env.PORT || 3000;
var domain =  process.env.DOMAIN;

function ensureDomain(req, res, next){
  if(!domain || req.hostname === domain){
    // OK, continue
    return next();
  };
  res.redirect('http://'+domain+req.url); // handle port numbers if you need non defaults
};


var app = express();
app.all('*', ensureDomain); // at top of routing calls
app.use(compression());
app.use(serveStatic(__dirname + '/public', {'extensions': ['html']}))  // default to .html ( you can omit the extension in the url )
app.listen(port, () => {
  console.log('server running...');
});
```

### 3. Create dist/package.json
```json
{
  "name": "mysite",
  "version": "0.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "engines":{
    "node": "4.1.1"
  },
  "dependencies": {
    "compression": "^1.4.4",
    "express": "^4.12.3",
    "serve-static": "^1.9.2"
  }
}
```

### 4. Push the dist folder to Heroku

Use the [Heroku Toolbelt](https://github.com/heroku/heroku)  to create an app and push your dist folder to the heroku server.

That's it!
