import { color } from '../color';
import { log } from '../log';

function colorByNumber(fn, num) {
  if (num > 0) {
    return fn(num);
  }

  return color.grey(num);
}

export function logSummary(stats) {
  const failed = stats.failures > 0;

  const logFn = failed ? log.error : log.info;

  if (failed) {
    logFn(color.red('𝘅 complete with failures'));
  } else {
    logFn(color.green('✔ complete'));
  }
  logFn('  pass:', colorByNumber(color.green, stats.passes));
  logFn('  fail:', colorByNumber(color.red, stats.failures));
  logFn('  pending:', colorByNumber(color.cyan, stats.pending));
  logFn('');
}