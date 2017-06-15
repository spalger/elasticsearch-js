const resolve = require('path').resolve;

exports.rel = resolve.bind(null, __dirname, '../../..');

exports.envPath = function (name) {
  if (process.env[name]) {
    return resolve(process.env[name]);
  }

  return require.resolve('./missing_env_arg.js');
};