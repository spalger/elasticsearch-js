import Rx from 'rxjs/Rx';
import expect from 'expect.js';

import { eventsToState } from '../test_state';

const neverEndingStream = (...of) => {
  return new Rx.Observable(observer => {
    of.forEach(item => observer.next(item));
  });
};

describe('eventsToState()', () => {
  it('filters out states before `runner:start`', async () => {
    const states = await eventsToState(
      Rx.Observable.of(
        { type: 'exception', payload: { foo: 'bar' } },
        { type: 'runner:start', payload: { total: 1 } }
      )
    )
    .toArray()
    .toPromise();

    expect(states).to.have.length(1);
    expect(states[0].exceptions).to.have.length(1);
  });

  it('completes the stream when the `runner:end` event is found', async () => {
    const states = await eventsToState(
      neverEndingStream(
        { type: 'runner:start', payload: { total: 1 } },
        { type: 'runner:test', payload: { id: 'foo', state: 'starting' } },
        { type: 'runner:test', payload: { id: 'foo', state: 'passed' } },
        { type: 'runner:test', payload: { id: 'bar', state: 'starting' } },
        { type: 'runner:test', payload: { id: 'bar', state: 'failed' } },
        { type: 'runner:end', payload: { stats: { passes: 1, failures: 1 } } },
        { type: 'exception', payload: { foo: 'bar' } }
      )
    )
    .toArray()
    .toPromise();

    expect(states).to.have.length(6);
    const last = states.pop();
    expect(last.tests).to.have.length(2);
  });
});