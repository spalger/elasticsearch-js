import { resolve as resolveUrl } from 'url';

import { log } from './log';
import { observeTestState } from './test_state';
import { withChromeRemote } from './chrome_remote';
import { createLogReporter } from './log_reporter';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms).unref());

export async function runTests(serverUrl, chromePort) {
  const URLS = [
    resolveUrl(serverUrl, 'unit.html'),
    resolveUrl(serverUrl, 'angular.html'),
    resolveUrl(serverUrl, 'browser.html'),
    resolveUrl(serverUrl, 'jquery.html'),
  ];

  for (const url of URLS) {
    log.info('');
    log.info('testing', url);

    await withChromeRemote(chromePort, url, async remote => {
      const testState$ = observeTestState(remote);
      await Promise.race([
        createLogReporter(testState$).done(),
        delay(3 * MINUTE).then(() => {
          throw new Error('Timeout: tests took over 3 minutes to compelte');
        }),
      ]);
    });
  }
}