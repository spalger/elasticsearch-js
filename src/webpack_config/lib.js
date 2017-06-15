
const rel = require('path').resolve.bind(null, __dirname, '../..');

function ignoreLoader(ignores) {
  return {
    loader: 'null-loader',
    test(path) {
      return ignores.some(ignore => path.includes(ignore));
    },
  };
}

function jsLoader() {
  return {
    loader: 'babel-loader',
    test: /\.js$/,
    include: /src(\/|\\)elasticsearch-js/,
  };
}

module.exports = { ignoreLoader, jsLoader, rel };
