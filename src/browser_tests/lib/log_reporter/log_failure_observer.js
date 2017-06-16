import chalk from 'chalk';

import { log } from '../log';

export function createLogFailureObserver() {
  return {
    next(test) {
      if (test.state !== 'failed') {
        return;
      }

      log.info('  ' + test.getPath());
      log.info('    ' + test.getTitle());
      log.info('      ' + chalk.red(test.error.message));
      log.info('    ' + chalk.grey(test.error.stack.split('\n').slice(1).join('\n    ')));
      log.info('');
    }
  };
}