import Rx from 'rxjs/Rx';

import { log } from './log';

export function observeBrowserMessages(client) {
  return new Rx.Observable(observer => {
    let open = true;

    function read() {
      client.Runtime.evaluate({
        expression: `
          new Promise(function (resolve, reject) {
            var messages = window.__msgs__ = window.__msgs__ || [];
            var queue = window.__msgq__ = window.__msgq__ || [];
            
            if (messages.length) {
              resolve(messages.shift())
            } else {
              queue.push(resolve)
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