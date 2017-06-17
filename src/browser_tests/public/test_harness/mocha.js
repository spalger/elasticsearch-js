const rootEl = document.createElement('div');
rootEl.id = 'mocha';
document.body.appendChild(rootEl);

require('script-loader!mocha/mocha.js');
require('mocha/mocha.css');

mocha.ui('bdd');
mocha.delay(true);

const runner = mocha.run();
require('./runner_events').attachToRunner(runner);
setTimeout(() => runner.suite.run(), 1);