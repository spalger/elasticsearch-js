import Rx from 'rxjs/Rx';
import * as chromeLauncher from 'chrome-launcher';

export function observeChrome() {
  return new Rx.Observable(observer => {
    chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu']
    }).then(chrome => {
      observer.next(chrome);
      observer.add(() => chrome.kill());
    }, error => {
      observer.error(error);
    });
  });
}
