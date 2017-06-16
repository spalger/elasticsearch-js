import chalk from 'chalk';

import { log } from '../log';

function color(fn, num) {
  if (num > 0) {
    return fn(num);
  }

  return chalk.grey(num);
}

export function logSummary(stats) {
  const failed = stats.failures > 0;

  const logFn = failed ? log.error : log.info;

  if (failed) {
    logFn(chalk.red('𝘅 complete with failures'));
  } else {
    logFn(chalk.green('✔ complete'));
  }
  logFn('  pass:', color(chalk.green, stats.passes));
  logFn('  fail:', color(chalk.red, stats.failures));
  logFn('  pending:', color(chalk.cyan, stats.pending));
  logFn('');
}