### v0.4.7

* 8d6962e Update .travis.yml
* 3faf45b Merge pull request #240 from alrra/update-htaccess
* 2410b17 Update to Apache Server Configs v2.1.0
* dcf330a Readme: adds screenshot of latest
* 52403a7 Readme: link up to Yeoman.io
* c50a4e2 Separate Bootstrap from Sass with Compass
* a84ee60 Bind Compass functions to compassBootstrap variable
* 35d3313 Merge pull request #234 from eddiemonge/js
* 80e88c2 readme - various improvements
* cacce74 Merge pull request #231 from eddiemonge/readdeps
* 012f34d note about 3rd party resources
* a723d21 improve package.json
* e4b80ef improve description message
* a6688c9 generate main.js when using coffee and allow it to come after plugins

### v0.4.6

TODO.

### v0.4.5

- Update to Apache Server Configs v2.1.0
- Fixes issues with Bower not always installing sub-generator dependencies
- Use `grunt-bower-install` for CSS dependencies
- skip install for hookfor framework if set on parent
- improve HTMLMin
- Added comments to Gruntfile
- grunt serve should serve compass images from tmp, not dist
- Prevent replacing of optimized gifs by copy task
- Bumped dependencies
- Remove version, add private to bower.json template
- Git ignore bower components in test dir

### v0.4.2 (2013-09-07)

- Easer livereload configuration thanks to grunt-contrib-connect 0.4
- grunt-open was replaced with new grunt-contrib-connect feature
- bootstrap-dropdown was added to requirejs config
- Bootstrap fonts are now correctly copied during build
