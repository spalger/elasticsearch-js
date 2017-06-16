import { observePageEvents } from './page_events';

const INITIAL_STATE = {
  complete: false
};

export function observeTestState(remote) {
  return observePageEvents(remote)
    .scan((state, event) => {
      switch (event.type) {
        case 'exception':
          const error = new Error('browser exception');
          error.stack = event.payload.stack;
          throw error;

        case 'console':
          console.log(`%s():`, event.payload.api,...event.payload.args);
          return state;

        case 'runner:end':
          return Object.assign({}, state, event.payload, {
            complete: true,
          });

        default:
          throw new Error('unexpected event ' + event.type);
      }
    }, INITIAL_STATE);
}