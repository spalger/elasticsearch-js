import webpack from 'webpack';
import WebpackMiddleware from 'webpack-dev-middleware';

import webpackConfig from '../../webpack_config/browser_tests';

export async function withWebpackMiddleware(block) {
  let webpackMiddleware;
  try {
    webpackMiddleware = new WebpackMiddleware(webpack(webpackConfig), {
      lazy: true,
      quiet: true,
      publicPath: '/'
    });

    await block(webpackMiddleware);
  } finally {
    if (webpackMiddleware) {
      webpackMiddleware.close();
    }
  }
}