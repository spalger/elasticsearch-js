const DefinePlugin = require('webpack/lib/DefinePlugin');
const { ignoreLoader, jsLoader, rel } = require('./lib');

module.exports = {
  context: rel('src/elasticsearch-js'),
  entry: './elasticsearch.angular.js',
  output: {
    filename: 'elasticsearch.angular.js',
    path: rel('dist'),
  },
  module: {
    loaders: [
      jsLoader(),
      ignoreLoader([
        'src/elasticsearch-js/lib/connectors/jquery.js',
        'src/elasticsearch-js/lib/connectors/xhr.js',
        'promise/lib/es6-extensions',
      ]),
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
  ],
};
