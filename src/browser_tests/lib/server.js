import { createServer } from 'http';
import { parse as parseUrl } from 'url';

import { fromNode as fcb } from 'bluebird';
import createExpress from 'express';

import { withChrome } from './chrome';
import { withWebpackMiddleware } from './webpack_middleware';
import { log } from './log';

export async function withServer(url, chromePort, block) {
  await withChrome(chromePort, async () => {
    await withWebpackMiddleware(async (webpackMiddleware) => {
      let server;
      try {
        const { port } = parseUrl(url);
        const express = createExpress();
        server = createServer(express);

        express.use(webpackMiddleware);
        await fcb(cb => server.listen(port, cb));
        log.info('started server at', url);

        await block(server);
      } finally {
        if (server) await server.close();
      }
    });
  });
}