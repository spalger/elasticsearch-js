import * as chromeLauncher from 'chrome-launcher';

export async function withChrome(block) {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu']
    });
    console.log('started chrome');
    await block(chrome);
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}
