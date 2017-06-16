import { observePageEvents } from './page_events';

const INITIAL_STATE = {
  exceptions: [],
  consoleCalls: [],
  tests: [],
  complete: false
};

export function observeTestState(remote) {
  return observePageEvents(remote)
    .scan((state, event) => {
      switch (event.type) {
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
              state.payload
            ]
          };

        case 'runner:end':
          return {
            ...state,
            ...event.payload,
            complete: true,
          };

        case 'runner:test end':
          return {
            ...state,
            tests: [
              ...(state.tests || []),
              { ...event.payload }
            ],
          };

        default:
          throw new Error('unexpected event ' + event.type);
      }
    }, INITIAL_STATE)
    .publishReplay(1)
    .refCount();
}