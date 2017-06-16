import chalk from 'chalk';

export function createLogFailureObserver() {
  return {
    next(test) {
      if (test.state !== 'failed') {
        return;
      }

      console.log('  ' + chalk.grey(test.path.join(' ≫ ')));
      console.log('    ' + chalk.white(test.title));
      console.log('      ' + chalk.red(test.error.message));
      console.log('    ' + chalk.grey(test.error.stack.split('\n').slice(1).join('\n    ')));
      console.log('');
    }
  };
}