import chalk from 'chalk';

export class ProgressLogger {
  currentTest;

  start() {
  }

  end() {
    this.currentTest = undefined;
    this._exitDots();
  }

  consoleCall(method, args) {
    this._exitDots();
    console.log(chalk.grey(`console.${method}:`), ...args);
  }

  testUpdate(test) {
    this._enterDots();
    switch (test.state) {
      case 'starting':
        this.currentTest = test;
        break;

      case 'passed':
        process.stdout.write(chalk.green('.'));
        break;

      case 'failed':
        process.stdout.write(chalk.red('𝘅'));
        break;

      default:
        throw new Error('unknown test state ' + test.state);
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