import Rx from 'rxjs/Rx';
import { Notification } from 'rxjs/Notification';

import { log } from '../log';

import { observeBrowserMessages } from './browser_messages';
import { observeRuntimeEvents } from './runtime_events';
import { Test } from './test';

const INITIAL_STATE = {
  exceptions: [],
  consoleCalls: [],
  tests: [],
  stats: null,
  started: false,
  complete: false,
};

export function observeTestState(remote) {
  return eventsToState(Rx.Observable.merge(
    observeBrowserMessages(remote),
    observeRuntimeEvents(remote)
  ));
}

export function eventsToState(events$) {
  return events$
    .scan((state, event) => {
      switch (event.type) {
        case 'runner:start':
          return {
            ...state,
            total: event.payload.total,
            started: true,
          };

        case 'runner:test':
          return {
            ...state,
            tests: [
              ...(state.tests || [])
                .filter(test => test.id !== event.payload.id),
              new Test(event.payload)
            ],
          };

        case 'runner:end':
          return {
            ...state,
            stats: event.payload.stats,
            complete: true,
          };

        case 'exception':
          return {
            ...state,
            exceptions: [
              ...state.exceptions,
              { ...event.payload }
            ]
          };

        case 'consoleCall':
          return {
            ...state,
            consoleCalls: [
              ...state.consoleCalls,
              event.payload
            ]
          };


        default:
          throw new Error('unexpected event ' + event.type);
      }
    }, INITIAL_STATE)
    .filter(state => state.started)
    .mergeMap(state => (
      state.complete
        ? [Notification.createNext(state), Notification.createComplete()]
        : [Notification.createNext(state)]
    ))
    .dematerialize()
    .do(state => log.verbose('test state', state));
}