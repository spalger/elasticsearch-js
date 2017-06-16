import webpack from 'webpack';
import WebpackMiddleware from 'webpack-dev-middleware';

import webpackConfig from '../../webpack_config/browser_tests';

export async function withWebpackMiddleware(block) {
  let webpackMiddleware;
  try {
    const compiler = webpack(webpackConfig);
    let runCount = 0;
    compiler.plugin('watch-run', (_, done) => {
      runCount += 1;
      if (runCount === 1) {
        console.log('webpack compiling bundles...');
      } else {
        console.log('webpack compiling bundles due to changes in files...');
      }
      done();
    });
    compiler.plugin('done', stats => {
      if (!stats.hasErrors()) {
        const durationMs = stats.endTime - stats.startTime;
        const durationSec = durationMs / 1000;
        console.log('webpack compilation successful in', durationSec.toFixed(2), 'seconds');
      }
    });

    webpackMiddleware = new WebpackMiddleware(compiler, {
      stats: 'errors-only',
      noInfo: true,
      publicPath: '/'
    });

    await block(webpackMiddleware);
  } finally {
    if (webpackMiddleware) {
      webpackMiddleware.close();
    }
  }
}