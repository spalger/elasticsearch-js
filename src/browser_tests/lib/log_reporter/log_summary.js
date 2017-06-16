import chalk from 'chalk';

function color(fn, num) {
  if (num > 0) {
    return fn(num);
  }

  return chalk.grey(num);
}

export function logSummary(stats) {
  if (stats.failures > 0) {
    console.log(chalk.red('𝘅 complete with failures'));
  } else {
    console.log(chalk.green('✔ complete'));
  }
  console.log('  pass:', color(chalk.green, stats.passes));
  console.log('  fail:', color(chalk.red, stats.failures));
  console.log('  pending:', color(chalk.cyan, stats.pending));
  console.log('');
}