import {
  withServer,
  runTests,
  setLogLevel,
  log,
} from './lib';

/**
 *  Do general CLI setup and then run a CLI Action (a function that takes the cmd)
 *  @param  {Command} cmd commander Command object
 *  @param  {Function} action
 *  @return {undefined}
 */
export function main(cmd, action) {
  Promise.resolve()
  .then(async () => {
    if (cmd.silent) setLogLevel('silent');
    else if (cmd.quiet) setLogLevel('error');
    else if (cmd.debug) setLogLevel('debug');
    else if (cmd.verbose) setLogLevel('verbose');
    else setLogLevel('info');

    await action(cmd);
  })
  .catch(error => {
    log.error('FATAL ERROR', error.stack);
  });
}

function keepServerRunning() {
  return new Promise(() => {
    log.info('Server running, use `node scripts/browser_tests runner` to run the tests');
    // never resolve, just wait until the process is closed
  });
}

/**
 *  Start the server and wait for the process to end
 *  @param  {Command} cmd
 *  @return {Promise<undefined>}
 */
export async function serverAction(cmd, subAction = keepServerRunning) {
  await withServer(cmd.url, cmd.chromePort, subAction);
}

/**
 *  Run the tests
 *  @param  {Command} cmd
 *  @return {Promise<undefined>}
 */
export async function testsAction(cmd) {
  const stats = await runTests(cmd.url, cmd.chromePort);
  const failureCount = stats.reduce((acc, s) => acc + s.failures, 0);
  process.exitCode = failureCount;
}

/**
 *  Start then server and then run the tests
 *  @param  {Command} cmd
 *  @return {Promise<undefined>}
 */
export async function serverAndTestsAction(cmd) {
  await serverAction(cmd, async () => {
    await testsAction(cmd);
  });
}

