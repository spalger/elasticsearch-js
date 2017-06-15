const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { jsLoader, rel } = require('./lib');

const CONTEXT_DIR = rel('src/browser_tests/public');
const OUTPUT_DIR = rel('tmp/browser_tests');

module.exports = {
  context: CONTEXT_DIR,
  entry: {
    angular: ['./mocha/setup', './entry/angular.js', './mocha/start'],
    browser: ['./mocha/setup', './entry/browser.js', './mocha/start'],
    jquery: ['./mocha/setup', './entry/jquery.js', './mocha/start']
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js',
  },
  module: {
    rules: [
      jsLoader(),
      {
        test: /.*\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin([OUTPUT_DIR], {
      root: rel(),
      verbose: false
    }),
    new HtmlWebpackPlugin({
      filename: 'angular.html',
      chunks: ['angular']
    }),
    new HtmlWebpackPlugin({
      filename: 'browser.html',
      chunks: ['browser']
    }),
    new HtmlWebpackPlugin({
      filename: 'jquery.html',
      chunks: ['jquery']
    })
  ],
  devServer: {
    contentBase: OUTPUT_DIR,
    watchOptions: {
      ignored: /\btmp\b/
    }
  }
};