import Rx from 'rxjs/Rx';
import webpack from 'webpack';
import WebpackMiddleware from 'webpack-dev-middleware';

import webpackConfig from '../../webpack_config/browser_tests';

export function observeWebpackMiddleware() {
  return new Rx.Observable(observer => {
    const webpackMiddleware = new WebpackMiddleware(webpack(webpackConfig), {
      lazy: true,
      quiet: true,
      publicPath: '/'
    });

    observer.next(webpackMiddleware);
    return () => webpackMiddleware.close();
  });
}