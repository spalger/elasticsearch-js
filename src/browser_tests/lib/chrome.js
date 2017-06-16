import * as chromeLauncher from 'chrome-launcher';

import { log } from './log';

export async function withChrome(block) {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({
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
