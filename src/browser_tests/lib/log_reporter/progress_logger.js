import chalk from 'chalk';

export class ProgressLogger {
  start() {
  }

  end() {
    this._exitDots();
  }

  consoleCall(method, args) {
    this._exitDots();
    console.log(chalk.grey(`console.${method}:`), ...args);
  }

  testComplete(test) {
    this._enterDots();
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

  _enterDots() {
    if (!this._inDots) {
      this._inDots = true;
    }
  }

  _exitDots() {
    if (this._inDots) {
      this._inDots = false;
      process.stdout.write('\n');
    }
  }
}