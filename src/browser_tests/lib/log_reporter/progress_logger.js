import { format } from 'util';
import { PassThrough } from 'stream';

import chalk from 'chalk';
import ProgressBar from 'progress';

import { testLogLevel } from '../log';

function indent(columns, text) {
  const margin = ' '.repeat(columns);
  text = String(text || '');
  if (!text) return text;
  return text
    .split('\n')
    .map(line => margin + line)
    .join('\n');
}

export class ProgressLogger {
  currentTest;
  lastTestMention;

  start(total) {
    const stream = testLogLevel('info') ? process.stdout : new PassThrough().resume();
    this.bar = new ProgressBar('running tests [:bar] :current/:total :percent', {
      total,
      clear: true,
      stream,
      width: process.stdout.columns / 3
    });
  }

  end() {
    this.currentTest = undefined;
    if (this.lastTestMention) {
      process.stdout.write('\n');
      this.lastTestMention = undefined;
    }
  }

  testMention(message) {
    if (this.lastTestMention !== this.currentTest) {
      this.lastTestMention = this.currentTest;
      this.bar.interrupt('\n' + this.currentTest.getFullTitle());
    }

    this.bar.interrupt(indent(2, message));
  }

  consoleCall(method, args) {
    this.testMention(format(chalk.grey(`console.${method}:`), ...args));
  }

  testUpdate(test) {
    switch (test.state) {
      case 'starting':
        this.currentTest = test;
        break;

      case 'passed':
        this.bar.tick();
        break;

      case 'failed':
        this.bar.tick();
        this.testMention(chalk.red('𝘅 fail'));
        break;

      default:
        throw new Error('unknown test state ' + test.state);
    }
  }
}