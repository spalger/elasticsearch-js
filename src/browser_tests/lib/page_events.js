import Rx from 'rxjs/Rx';

import { observeBrowserMessages } from './browser_messages';
import { inspectRemoteObject } from './inspect';

export function observePageEvents(remote) {
  return Rx.Observable.merge(
    Rx.Observable
      .fromEvent(remote, 'Runtime.exceptionThrown')
      .map(({ exceptionDetails }) => ({
        type: 'exception',
        payload: {
          stack: exceptionDetails.exception.description
        }
      })),

    Rx.Observable.fromEvent(remote, 'Runtime.consoleAPICalled')
      .map(({ type, args }) => ({
        type: 'console',
        payload: {
          api: `console.${type}`,
          args: args.map(inspectRemoteObject)
        }
      })),

    observeBrowserMessages(remote),
  );
}