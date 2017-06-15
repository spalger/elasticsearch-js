import Rx from 'rxjs/Rx';

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

        observer.next(resp.result.value);
        read();
      })
      .catch((error) => {
        if (!open) return;
        observer.error(error);
      });
    }

    read();
    return () => open = false;
  });
}