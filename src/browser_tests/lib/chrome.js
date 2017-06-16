import * as chromeLauncher from 'chrome-launcher';

import { log } from './log';

export async function withChrome(port, block) {
  let chrome;
  try {
    log.debug('starting chrome on port', port);
    chrome = await chromeLauncher.launch({
      port,
      chromeFlags: ['--headless', '--disable-gpu']
    });
    log.debug('chrome started');
    await block(chrome);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}
