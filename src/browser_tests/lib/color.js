import chalk from 'chalk';

// eslint-disable-next-line
export let color;

export function setColorEnabled(enabled) {
  color = new chalk.constructor({
    enabled: !!enabled
  });
}

setColorEnabled(true);