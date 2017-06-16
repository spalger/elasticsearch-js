import { Command } from 'commander';

import {
  withChrome,
  withServer,
  withChromeRemote,
  observeTestState,
  createLogReporter,
  setLogLevel,
  log,
} from './lib';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms).unref());

const cmd = new Command('node scripts/browser_tests');
cmd
  .description('Run browser tests in an instance of headless chrome')
  .option('--silent', 'log nothing')
  .option('--quiet', 'only log errors')
  .option('--debug', 'turn on a little extra logging')
  .option('--verbose', 'for people who love console.log');

const URL = 'http://localhost:8080';
const URLS = [
  URL + '/unit.html',
  URL + '/angular.html',
  URL + '/browser.html',
  URL + '/jquery.html',
];

async function main() {
  if (cmd.silent) setLogLevel('silent');
  else if (cmd.quiet) setLogLevel('error');
  else if (cmd.debug) setLogLevel('debug');
  else if (cmd.verbose) setLogLevel('verbose');
  else setLogLevel('info');

  await withChrome(async chrome => {
    await withServer(URL, async () => {
      for (const url of URLS) {
        log.info('');
        log.info('testing', url);
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
  log.error('FATAL ERROR', error.stack);
});