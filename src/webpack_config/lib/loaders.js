const rel = require('./paths').rel;

exports.ignoreLoader = function (ignores) {
  return {
    loader: 'null-loader',
    test(path) {
      return ignores.some(ignore => path.includes(ignore));
    },
  };
};

exports.jsLoader = function () {
  return {
    test: /\.js$/,
    include: [ rel('src') ],
    loader: 'babel-loader',
    options: {
      babelrc: false,
      plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
      ],
      presets: [
        [ 'env', { targets: { browser: '>0.3%' } } ]
      ]
    }
  };
};