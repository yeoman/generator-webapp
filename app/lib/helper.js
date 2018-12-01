const mkdirp = require('mkdirp');

function createDirectory(path) {
  mkdirp(path);
}

function copy(input, output) {
  this.fs.copy(
    this.templatePath(input),
    this.destinationPath(output)
  );
}


function copyTpl(input, output, data) {
  this.fs.copyTpl(
    this.templatePath(input),
    this.destinationPath(output),
    data
  );
}

module.exports = {
  copyTpl,
  copy,
  createDirectory
};