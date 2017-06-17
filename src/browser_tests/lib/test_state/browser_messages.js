import Rx from 'rxjs/Rx';

import { log } from '../log';

export function observeBrowserMessages(remote) {
  return new Rx.Observable(observer => {
    let open = true;

    function read() {
      remote.Runtime.evaluate({
        expression: `
          new Promise(function (resolve, reject) {
            var events = window.__runnerEvents__ = window.__runnerEvents__ || [];
            if (events.length && typeof events[0] !== 'function') {
              resolve(events.shift())
            } else {
              events.push(resolve)
            }
          })
        `,
        returnByValue: true,
        awaitPromise: true,
      })
      .then((resp) => {
        if (!open) return;

        log.verbose('received browser message', resp.result.value);
        observer.next(resp.result.value);
        read();
      })
      .catch((error) => {
        if (!open) return;

        log.error('error reading browser message', error.stack);
        observer.error(error);
      });
    }

    read();
    return () => open = false;
  });
}