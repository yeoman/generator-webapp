### v0.4.5

- Fixes issues with Bower not always installing sub-generator dependencies
- Use `grunt-bower-install` for CSS dependencies
- skip install for hookfor framework if set on parent
- improve HTMLMin
- Added comments to Gruntfile
- grunt serve should serve compass images from tmp, not dist 
- Prevent replacing of optimized gifs by copy task
- Update to Apache Server Configs v2.0.0
- Bumped dependencies
- Remove version, add private to bower.json template
- Git ignore bower components in test dir

### v0.4.2 (2013-09-07)

- Easer livereload configuration thanks to grunt-contrib-connect 0.4
- grunt-open was replaced with new grunt-contrib-connect feature
- bootstrap-dropdown was added to requirejs config
- Bootstrap fonts are now correctly copied during build
