
var util = require('util'),
    fs = require('fs'),
    path = require('path'),
    yeoman = require('../../../../');

module.exports = AppGenerator;

// this example defines a prompt-app generator for demonstration purpose.
//
// So we need to hook other generators with the appropriate context (stylesheet-engine mainly)


function AppGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.test_framework = options['test-framework'] || 'mocha';

  // cleanup the name property from trailing /, typical usage of directories.
  // update the args object, it's used to initialize js-framework hooks
  if(this.name) this.args[0] = this.args[0].replace(/\/$/, '');

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  this.mainJsFile = '';
}

util.inherits(AppGenerator, yeoman.generators.NamedBase);


AppGenerator.prototype.askFor = function askFor (argument) {
  var cb = this.async(),
    self = this;


  // Welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |'+'--(o)--'.red+'|   .--------------------------.' +
  '\n   `---------´  |    '+'Welcome to Yeoman,'.yellow.bold+'    |' +
  '\n    '+'( '.yellow+'_'+'´U`'.yellow+'_'+' )'.yellow+'   |   '+'ladies and gentlemen!'.yellow.bold+'  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __'+'\'.___.\''.yellow+'__' +
  '\n ´   '+'`  |'.red+'° '+'´ Y'.red+' `\n';

  console.log(welcome);
  console.log('Out of the box I include HTML5 Boilerplate, jQuery and Modernizr.');

  // a bit verbose prompt configuration, maybe we can improve that
  // demonstration purpose. Also, probably better to have this in other generator, whose responsability is to ask
  // and fetch all realated bootstrap stuff, that we hook from this generator.
  var prompts = [{
    name: 'compassBootstrap',
    message: 'Would you like to include Twitter Bootstrap for Compass instead of CSS?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  },{
    name: 'bootstrap',
    message: 'Would you like to include the Twitter Bootstrap JS plugins?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap plugins will be placed into the JavaScript vendor directory.'
  },
  {
    name: 'includeRequireJS',
    message: 'Would you like to include RequireJS (for AMD support)?',
    default: 'Y/n',
    warning: 'Yes: RequireJS will be placed into the JavaScript vendor directory.'
  },
  {
    name: 'includeRequireHM',
    message: 'Would you like to support writing ECMAScript 6 modules?',
    default: 'Y/n',
    warning: 'Yes: RequireHM will be placed into the JavaScript vendor directory.'
  }];

  this.prompt(prompts, function(e, props) {
    if(e) { return self.emit('error', e); }

    // manually deal with the response, get back and store the results.
    // We change a bit this way of doing to automatically do this in the self.prompt() method.
    self.bootstrap = (/y/i).test(props.bootstrap);
    self.compassBootstrap = (/y/i).test(props.compassBootstrap);
    self.includeRequireJS = (/y/i).test(props.includeRequireJS);
    self.includeRequireHM = (/y/i).test(props.includeRequireHM);

    // we're done, go through next step
    cb();
  });
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  // this.write('foo.js', '');
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};

AppGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AppGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

AppGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

AppGenerator.prototype.favicon = function favicon(){
  this.copy('favicon.ico', 'app/favicon.ico');
};

AppGenerator.prototype.mainStylesheet = function mainStylesheet(){
  if ( !this.compassBootstrap ) {
    this.write('app/styles/main.css', "/* Will be compiled down to a single stylesheet with your sass files */");
  }
};

AppGenerator.prototype.bootstrapImages = function bootstrapImages() {
  this.copy('glyphicons-halflings.png', 'app/images/glyphicons-halflings.png');
  this.copy('glyphicons-halflings-white.png', 'app/images/glyphicons-halflings-white.png');
};

AppGenerator.prototype.fetchH5bp = function fetchH5bp() {
  var cb = this.async();

  // Using sha since the lastest tag is so old
  this.remote('h5bp', 'html5-boilerplate', '456211dc54c7a0328485d73cf25443d210d8e1d8', function(err, remote) {
    if(err) { return cb(err); }

    remote.copy( '.htaccess', 'app/.htaccess' );
    remote.copy( '404.html', 'app/404.html' );
    remote.copy( 'robots.txt', 'app/robots.txt' );
    remote.copy( 'js/vendor/jquery-1.8.0.min.js', 'app/scripts/vendor/jquery.min.js' );
    remote.copy( 'js/vendor/modernizr-2.6.1.min.js', 'app/scripts/vendor/modernizr.min.js' );

    this.indexFile = this.readFileAsString(path.join(remote.cachePath, 'index.html'));

    cb();
  }.bind(this));
};

AppGenerator.prototype.fetchBootstrap = function fetchBootstrap() {
  // prevent the bootstrap fetch is user said NO
  if(!this.bootstrap) { return; }

  var cb = this.async();

  // third optional argument is the branch / sha1. Defaults to master when ommitted.
  this.remote('twitter', 'bootstrap', 'v2.1.0', function(err, remote, files) {
    if(err) { return cb(err); }

    'affix alert button carousel collapse dropdown modal popover scrollspy tab tooltip transition typeahead'.split(' ')
    .forEach(function( el ) {
      var filename = 'bootstrap-' + el + '.js';
      remote.copy( 'js/' + filename, 'app/scripts/vendor/bootstrap/' + filename );
    });

    cb();
  });
};

// Duplicated from the SASS generator, waiting a solution for #138
AppGenerator.prototype.compassBootstrapFiles = function compassBootstrapFiles() {
  if ( this.compassBootstrap ) {
    var cb = this.async();

    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');

    this.remote('kristianmandrup', 'compass-twitter-bootstrap', 'c3ccce2cca5ec52437925e8feaaa11fead51e132', function(err, remote) {
      if(err) { return cb(err); }

      remote.directory('stylesheets', 'app/styles');

      cb();
    });
  } else {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy( 'bootstrap.css', 'app/styles/bootstrap.css' );
  }
};


AppGenerator.prototype.writeIndex = function writeIndex() {

  var $;

  // Resolve path to index.html
  var indexOut = path.resolve('app/index.html');

  // Read in as string for further update
  var indexData = this.indexFile;

  // Prepare default content text
  var defaults = ['HTML5 Boilerplate','Twitter Bootstrap'];
  var contentText = [
    '    <div class="container" style="margin-top:50px">',
    '        <div class="hero-unit">',
    '            <h1>Wotcha!</h1>',
    '            <p>You now have</p>',
    '            <ul>'
  ];

  // Strip sections of H5BP we're going to overwrite
  indexData = this.removeScript(indexData, 'plugins.js');
  indexData = this.removeScript(indexData, 'main.js');
  indexData = this.removeStyle(indexData, 'normalize.css');

  indexData = indexData.replace(/js\/vendor\/jquery[^"]+/g, 'scripts/vendor/jquery.min.js');

  $ = require('cheerio').load( indexData );
  $('link[href="css/main.css"]').attr('href', 'styles/main.css');
  $('script[src^="js/vendor/modernizr"]').attr('src', 'scripts/vendor/modernizr.min.js');
  indexData = $.html();

  // Asked for Twitter bootstrap plugins?
  if(this.bootstrap) {

    defaults.push('Twitter Bootstrap plugins');

    // Wire Twitter Bootstrap plugins (usemin: scripts/plugins.js)
    indexData = this.appendScripts(indexData, 'scripts/plugins.js', [
      'scripts/vendor/bootstrap/bootstrap-affix.js',
      'scripts/vendor/bootstrap/bootstrap-alert.js',
      'scripts/vendor/bootstrap/bootstrap-dropdown.js',
      'scripts/vendor/bootstrap/bootstrap-tooltip.js',
      'scripts/vendor/bootstrap/bootstrap-modal.js',
      'scripts/vendor/bootstrap/bootstrap-transition.js',
      'scripts/vendor/bootstrap/bootstrap-button.js',
      'scripts/vendor/bootstrap/bootstrap-popover.js',
      'scripts/vendor/bootstrap/bootstrap-typeahead.js',
      'scripts/vendor/bootstrap/bootstrap-carousel.js',
      'scripts/vendor/bootstrap/bootstrap-scrollspy.js',
      'scripts/vendor/bootstrap/bootstrap-collapse.js',
      'scripts/vendor/bootstrap/bootstrap-tab.js'
     ]);
  }

  if(this.includeRequireJS){
    defaults.push('RequireJS');
  }

  if(this.includeRequireHM){
    defaults.push('Support for ES6 Modules');
  }

  // Iterate over defaults, create content string
  defaults.forEach(function(i,x){
    contentText.push('                <li>' + i  +'</li>');
  });


  contentText = contentText.concat([
    '            </ul>',
    '            <p>installed.</p>',
    '            <h3>Enjoy coding! - Yeoman</h3>',
    '        </div>',
    '    </div>',
    ''
  ]);

  // Append the default content
  indexData = indexData.replace('<body>', '<body>\n' + contentText.join('\n'));

  this.indexFile = indexData;
};

// XXX to be put in a subgenerator like rjs:app, along the fetching or require.js /
// almond lib
AppGenerator.prototype.requirejs = function requirejs(){
  var cb = this.async(),
    self = this;

  if(self.includeRequireJS){

    this.remote('jrburke', 'requirejs', '2.0.5', function(err, remote) {
      if(err) { return cb(err); }
      remote.copy('require.js', 'app/scripts/vendor/require.js');

      // Wire RequireJS/AMD (usemin: js/amd-app.js)
      this.indexFile = this.appendScripts(this.indexFile, 'scripts/amd-app.js', ['scripts/vendor/require.js'], {
        'data-main': 'scripts/main'
      });

      // add a basic amd module (should be a file in templates/)
      this.write('app/scripts/app.js',[
        "define([], function() {",
        "  return 'Hello from Yeoman!';",
        "});"
      ].join('\n'));

      this.mainJsFile = [
        "require.config({",
        "  shim: {",
        "  },",
        "",
        "  paths: {",
        "    jquery: 'vendor/jquery.min'",
        "  }",
        "});",
        " ",
        "require(['app'], function(app) {",
        "  // use app here",
        "  console.log(app);",
        "});"
      ].join('\n');

      cb();
    }.bind(this));

  } else {
    cb();
  }
};


AppGenerator.prototype.requirehm = function requirehm(){
  var cb = this.async(),
    self = this;

  if(self.includeRequireHM){

    this.remote('jrburke', 'require-hm', '0.2.1', function(err, remote) {
      if(err) { return cb(err); }
      remote.copy('hm.js', 'app/scripts/vendor/hm.js');
      remote.copy('esprima.js', 'app/scripts/vendor/esprima.js');

      // Wire RequireJS/AMD (usemin: js/amd-app.js)
      this.mainJsFile = this.mainJsFile.replace('paths: {', 'paths: {\n    hm: \'vendor/hm\',\n    esprima: \'vendor/esprima\',');

      cb();
    }.bind(this));

  } else {
    cb();
  }
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.mkdir('app/templates');
  this.write('app/index.html', this.indexFile);
  this.write('app/scripts/main.js', this.mainJsFile);
};

AppGenerator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('test/spec');
};
