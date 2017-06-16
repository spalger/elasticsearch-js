const DefinePlugin = require('webpack/lib/DefinePlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { ignoreLoader, jsLoader, rel } = require('./lib');

const plugins = (type) => [
  // clear previous build output
  new CleanWebpackPlugin([
    rel('dist', type ? `elasticsearch.${type}.js` : 'elasticsearch.js'),
    rel('dist', type ? `elasticsearch.${type}.min.js` : 'elasticsearch.min.js')
  ], {
    root: rel(),
    verbose: false
  }),

  // define "production" mode for code cleanup
  new DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),
];

module.exports = [
  /**
   *  Generic browser client config
   */
  {
    context: rel('src/elasticsearch-js'),
    entry: './elasticsearch.js',
    output: {
      filename: 'elasticsearch.js',
      path: rel('dist'),
      library: 'elasticsearch',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [
        jsLoader(),
        ignoreLoader([
          'src/elasticsearch-js/lib/connectors/jquery.js',
          'src/elasticsearch-js/lib/connectors/angular.js'
        ]),
      ],
    },
    plugins: plugins(),
  },

  /**
   *  Angular browser client config
   */
  {
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
    plugins: plugins('angular'),
  },

  /**
   *  jQuery browser client config
   */
  {
    context: rel('src/elasticsearch-js'),
    entry: './elasticsearch.jquery.js',
    output: {
      filename: 'elasticsearch.jquery.js',
      path: rel('dist'),
    },
    module: {
      loaders: [
        jsLoader(),
        ignoreLoader([
          'src/elasticsearch-js/lib/connectors/angular.js',
          'src/elasticsearch-js/lib/connectors/xhr.js',
          'promise/lib/es6-extensions',
        ]),
      ],
    },
    plugins: plugins('jquery'),
  }
];
