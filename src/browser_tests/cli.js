import { Command } from 'commander';

import {
  withChrome,
  withServer,
  withChromeRemote,
  observeTestState,
} from './lib';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms).unref());

const cmd = new Command('node scripts/browser_tests');
cmd.description('Run browser tests in an instance of headless chrome');

const URL = 'http://localhost:8080';
const URLS = [
  URL + '/angular.html',
  URL + '/browser.html',
  URL + '/jquery.html',
];

async function main() {
  await withChrome(async chrome => {
    await withServer(URL, async () => {
      for (const url of URLS) {
        console.log('');
        console.log('testing', url);
        await withChromeRemote(chrome, url, async remote => {
          const results = await Promise.race([
            observeTestState(remote)
              .filter(state => state.complete)
              .first()
              .toPromise(),

            delay(3 * MINUTE).then(() => {
              throw new Error('Timeout: tests took over 3 minutes to compelte');
            }),
          ]);

          console.log('  pass:', results.stats.passes);
          console.log('  fail:', results.stats.failures);
          console.log('  pending:', results.stats.pending);
          console.log('  total:', results.stats.tests);
          console.log('------------------');
          console.log('');
        });
      }
    });
  });
}

main().catch(error => {
  console.log('FATAL ERROR', error.stack);
});