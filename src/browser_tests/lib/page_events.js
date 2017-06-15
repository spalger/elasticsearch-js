import Rx from 'rxjs/Rx';
import createCRI from 'chrome-remote-interface';

import { observeBrowserMessages } from './browser_messages';
import { inspectRemoteObject } from './inspect';

export function observePageEvents(chrome, url) {
  const client$ = new Rx.Observable(observer => {
    createCRI({ port: chrome.port })
      .then(
        client => {
          observer.next(client);
          observer.add(() => client.close());
        },
        error => observer.error(error)
      );
  });

  return client$
    .mergeMap(client => (
      Rx.Observable
        .from(Promise.all([
          client.Page.enable(),
          client.Runtime.enable(),
        ]))
        .do(() => {
          console.log('navigating to', url);
          client.Page.navigate({ url });
        })
        .mergeMap(() => (
          Rx.Observable
            .fromEvent(client, 'Page.frameNavigated')
            .first()
        ))
        .mergeMap(() => Rx.Observable.merge(
          Rx.Observable
            .fromEvent(client, 'Runtime.exceptionThrown')
            .map(({ exceptionDetails }) => ({
              type: 'exception',
              payload: {
                stack: exceptionDetails.exception.description
              }
            })),

          Rx.Observable.fromEvent(client, 'Runtime.consoleAPICalled')
            .map(({ type, args }) => ({
              type: 'console',
              payload: {
                api: `console.${type}`,
                args: args.map(inspectRemoteObject)
              }
            })),

          observeBrowserMessages(client),
        ))
    ));
}