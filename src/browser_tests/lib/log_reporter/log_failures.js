import chalk from 'chalk';

import { log } from '../log';

export function logFailures(tests) {
  tests
    .filter(test => test.state === 'failed')
    .forEach(() => {
      log.info('  ' + test.getPath());
      log.info('    ' + test.getTitle());
      log.info('      ' + chalk.red(test.error.message));
      log.info('    ' + chalk.grey(test.error.stack.split('\n').slice(1).join('\n    ')));
      log.info('');
    });
}