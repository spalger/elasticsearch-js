import Rx from 'rxjs/Rx';

import { observeBrowserMessages } from './browser_messages';

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
        type: 'consoleCall',
        payload: {
          method: type,
          args: args.map(arg => arg.preview || arg.value)
        }
      })),

    observeBrowserMessages(remote),
  );
}