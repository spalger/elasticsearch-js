let level = 'info';
const levels = [
  'silent',
  'error',
  'info',
  'debug',
  'verbose',
];

export function indent(columns, text) {
  const margin = ' '.repeat(columns);
  text = String(text || '');
  if (!text) return text;
  return text
    .split('\n')
    .map(line => margin + line)
    .join('\n');
}

export function setLogLevel(newLevel) {
  if (!levels.includes(newLevel)) {
    throw new Error(`invalid log level ${newLevel}`);
  }
  level = newLevel;
}

export function getLogLevel() {
  return level;
}

export function testLogLevel(test) {
  return levels.includes(test) && levels.indexOf(test) <= levels.indexOf(level);
}

export const log = {
  info(...args) {
    if (testLogLevel('info')) {
      console.log(...args); // eslint-disable-line no-console
    }
  },

  debug(...args) {
    if (testLogLevel('debug')) {
      console.log(...args); // eslint-disable-line no-console
    }
  },

  error(...args) {
    if (testLogLevel('error')) {
      console.log(...args); // eslint-disable-line no-console
    }
  },

  verbose(...args) {
    if (testLogLevel('verbose')) {
      console.log(...args); // eslint-disable-line no-console
    }
  }
};