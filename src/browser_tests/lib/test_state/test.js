import { color } from '../color';

export class Test {
  constructor(properties) {
    Object.assign(this, properties);
  }

  getPath() {
    return color.grey(this.path.join(' ≫ '));
  }

  getTitle() {
    return color.white(this.title);
  }

  getFullTitle() {
    return `${this.getPath()} ${this.getTitle()}`;
  }
}