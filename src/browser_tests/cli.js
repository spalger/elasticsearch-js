import { Command } from 'commander';

import {
  withChrome,
  withServer,
  withChromeRemote,
  observeTestState,
  createLogReporter,
} from './lib';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms).unref());

const cmd = new Command('node scripts/browser_tests');
cmd.description('Run browser tests in an instance of headless chrome');

const URL = 'http://localhost:8080';
const URLS = [
  URL + '/unit.html',
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
          const testState$ = observeTestState(remote);
          await Promise.race([
            createLogReporter(testState$).done(),
            delay(3 * MINUTE).then(() => {
              throw new Error('Timeout: tests took over 3 minutes to compelte');
            }),
          ]);
        });
      }
    });
  });
}

main().catch(error => {
  console.log('FATAL ERROR', error.stack);
});