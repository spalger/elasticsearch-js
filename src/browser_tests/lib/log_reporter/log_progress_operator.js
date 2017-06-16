import chalk from 'chalk';

import { PassThroughSub } from './pass_through_sub';

class LogProgressSub extends PassThroughSub {
  count = 0;

  next(test) {
    this.count += 1;
    if (this.count === 1) {
      process.stdout.write('progress: ');
    }

    switch (test.state) {
      case 'passed':
        process.stdout.write(chalk.green('.'));
        break;

      case 'failed':
        process.stdout.write(chalk.red('𝘅'));
        break;

      default:
        process.stdout.write(chalk.gray('.'));
        break;
    }
  }

  // custom close method linked up in operator
  close() {
    process.stdout.write('\n');
  }
}
export function createLogProgressOperator() {
  return function (source) {
    const subscriber = new LogProgressSub(this);
    this.add(() => subscriber.close());
    this.add(source.subscribe(subscriber));
  };
}