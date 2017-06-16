const rootEl = document.createElement('div');
rootEl.id = 'mocha';
document.body.appendChild(rootEl);

require('script-loader!source-map-support/browser-source-map-support.js');
/* global sourceMapSupport */
sourceMapSupport.install();

require('script-loader!mocha/mocha.js');
require('mocha/mocha.css');

mocha.ui('bdd');