const { relative } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { jsLoader, rel } = require('./lib');

const CONTEXT_DIR = rel('src/browser_tests/public');
const OUTPUT_DIR = rel('tmp/browser_tests');

module.exports = {
  context: CONTEXT_DIR,
  entry: {
    angular: ['./test_harness', './entry/angular.js'],
    browser: ['./test_harness', './entry/browser.js'],
    jquery: ['./test_harness', './entry/jquery.js'],
    unit: ['./test_harness', './entry/unit.js'],
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js',
    devtoolModuleFilenameTemplate: info => `webpack:${relative(CONTEXT_DIR, info.resourcePath)}`
  },
  devtool: 'cheap-source-map',
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
  resolve: {
    unsafeCache: true,
    alias: {
      'sinon$': require.resolve('sinon/pkg/sinon')
    }
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
    }),
    new HtmlWebpackPlugin({
      filename: 'unit.html',
      chunks: ['unit']
    })
  ],
  devServer: {
    contentBase: OUTPUT_DIR,
    watchOptions: {
      ignored: /\btmp\b/
    }
  }
};