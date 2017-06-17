import Rx from 'rxjs/Rx';

import { logFailures } from './log_failures';
import { ProgressLogger } from './progress_logger';
import { logSummary } from './log_summary';

export async function logReporter(testState$) {
  testState$ = testState$
    .publishReplay(1)
    .refCount();

  const progress = new ProgressLogger();

  const initialState$ = testState$.first();
  const finalState$ = testState$.last();

  /**
   *  Starts the progress router on the first testState
   *  @type {[type]}
   */
  const startProgress$ = initialState$
    .do(state => progress.start(state.total))
    .share();

  /**
   *  Sends console.foo() calls to the progress logger
   *  @type {Rx.Observable}
   */
  const consoleCallLogging$ = startProgress$.concat(
    testState$
      .map(state => state.consoleCalls && state.consoleCalls[state.consoleCalls.length - 1])
      .distinctUntilChanged()
      .takeUntil(finalState$)
      .filter(Boolean)
      .do(call => {
        progress.consoleCall(call.method, call.args);
      })
  );

  /**
   *  Logs a progress indicator to the console for each test added
   *  to the tests state
   *  @type {Rx.Observable}
   */
  const testLogging$ = startProgress$.concat(
    testState$
      .mergeMap(state => state.tests)
      .groupBy(test => test.id)
      .mergeMap(group => group.distinctUntilChanged())
      .takeUntil(finalState$)
      .do(test => {
        progress.testUpdate(test);
      })
  );

  /**
   *  Represents the all progress logging
   *  @type {Rx.Observable}
   */
  const progressLogging$ = Rx.Observable
    .merge(consoleCallLogging$, testLogging$)
    .do({
      complete() {
        progress.end();
      }
    });

  /**
   *  Logs a summary about execution after the progressLogging$ is done
   *  @type {Rx.Observable}
   */
  const completionLogging$ = progressLogging$
    .ignoreElements()
    .concat(testState$.last())
    .do(state => logFailures(state.tests))
    .do(state => logSummary(state.stats));

  await completionLogging$.toPromise();
}