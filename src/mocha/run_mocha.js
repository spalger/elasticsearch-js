const debugFlags = ['--debug', '--debug-brk', '-d', '--inspect'];
const debugInBand = process.argv.some(arg => debugFlags.includes(arg));

process.argv.push('-r', require.resolve('./mocha_setup'));

if (debugInBand) {
  process.argv.push('--no-timeouts');
  require('mocha/bin/_mocha');
} else {
  require('mocha/bin/mocha');
}