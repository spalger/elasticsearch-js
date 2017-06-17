import { format } from 'util';

import ProgressBar from 'progress';

import { color } from '../color';
import { log, testLogLevel, indent } from '../log';

export class ProgressLogger {
  currentTest;
  lastTestMention;

  start(total) {
    if (process.stdout.isTTY && testLogLevel('info')) {
      this.bar = new ProgressBar('running tests [:bar] :current/:total :percent', {
        total,
        clear: true,
        width: Math.round(process.stdout.columns / 3)
      });
    }
  }

  end() {
    this.currentTest = undefined;
    if (this.lastTestMention) {
      log.info('');
      this.lastTestMention = undefined;
    }
  }

  testMention(message) {
    if (this.currentTest && this.lastTestMention !== this.currentTest) {
      this.lastTestMention = this.currentTest;
      this.interrupt('\n' + this.currentTest.getFullTitle());
    }

    this.interrupt(indent(2, message));
  }

  consoleCall(method, args) {
    this.testMention(format(color.grey(`console.${method}:`), ...args));
  }

  testUpdate(test) {
    switch (test.state) {
      case 'starting':
        this.currentTest = test;
        break;

      case 'passed':
        this.tick();
        break;

      case 'failed':
        this.tick();
        this.testMention(color.red('𝘅 fail'));
        break;

      default:
        throw new Error('unknown test state ' + test.state);
    }
  }

  tick() {
    if (this.bar) {
      this.bar.tick();
    }
  }

  interrupt(msg) {
    if (this.bar) {
      this.bar.interrupt(msg);
    } else {
      log.info(msg);
    }
  }
}