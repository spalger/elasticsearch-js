import chalk from 'chalk';

export class Test {
  constructor(properties) {
    Object.assign(this, properties);
  }

  getPath() {
    return chalk.grey(this.path.join(' ≫ '));
  }

  getTitle() {
    return chalk.white(this.title);
  }

  getFullTitle() {
    return `${this.getPath()} ${this.getTitle()}`;
  }
}