import { resolve as resolveUrl } from 'url';

import { log } from './log';
import { observeTestState } from './test_state';
import { withChromeRemote } from './chrome_remote';
import { logReporter } from './log_reporter';

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

  const stats = [];

  for (const url of URLS) {
    log.info('');
    log.info('testing', url);

    await withChromeRemote(chromePort, url, async remote => {
      const testState$ = observeTestState(remote).share();
      const [testState] = await Promise.all([
        Promise.race([
          testState$.last().toPromise(),
          delay(3 * MINUTE).then(() => {
            throw new Error('Timeout: tests took over 3 minutes to compelte');
          }),
        ]),
        logReporter(testState$),
      ]);

      stats.push(testState.stats);
    });
  }

  return stats;
}