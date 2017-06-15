import { createServer } from 'http';
import { parse as parseUrl } from 'url';

import Rx from 'rxjs/Rx';
import createExpress from 'express';

import { observeWebpackMiddleware } from './webpack_middleware';

export function observeServer(url) {
  return observeWebpackMiddleware()
    .mergeMap(webpackMiddleware => new Rx.Observable(observer => {
      const { port } = parseUrl(url);
      const express = createExpress();
      const server = createServer(express);

      express.use(webpackMiddleware);
      server.listen(port, error => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(server);
        }

        observer.add(() => server.close());
      });
    }));
}