const DefinePlugin = require('webpack/lib/DefinePlugin');
const { ignoreLoader, jsLoader, rel } = require('./lib');

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
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
    ],
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
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
    ],
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
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),
    ],
  }
];
