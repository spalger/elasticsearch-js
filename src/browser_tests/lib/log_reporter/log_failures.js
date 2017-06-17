import chalk from 'chalk';

import { log, indent } from '../log';

export function logFailures(tests) {
  const failures = tests.filter(test => test.state === 'failed');

  if (!failures.length) {
    return;
  }

  if (failures.length === 1) {
    log.info('1 failure:');
  } else {
    log.info(failures.length, 'failures:');
  }

  failures.forEach(test => {
    log.info(indent(2, test.getPath()));
    log.info(indent(4, test.getTitle()));
    log.info(indent(6, chalk.red(test.error.message)));
    log.info(indent(8, chalk.grey(
      test.error.stack
        .split('\n')
        .slice(1)
        .map(line => line.trim())
        .join('\n')
    )));
  });
  log.info('');
}