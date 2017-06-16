import { observePageEvents } from './page_events';
import { Test } from './test';
import { log } from './log';

const INITIAL_STATE = {
  exceptions: [],
  consoleCalls: [],
  tests: [],
  stats: null,
  started: false,
  complete: false,
};

export function observeTestState(remote) {
  return observePageEvents(remote)
    .scan((state, event) => {
      switch (event.type) {
        case 'start':
          return {
            ...state,
            total: event.payload.total,
            started: true,
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

        case 'runner:end':
          return {
            ...state,
            stats: event.payload.stats,
            complete: true,
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

        default:
          throw new Error('unexpected event ' + event.type);
      }
    }, INITIAL_STATE)
    .do(state => log.verbose('test state', state))
    .publishReplay(1)
    .refCount();
}