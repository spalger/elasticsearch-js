import { createLogFailureObserver } from './log_failure_observer';
import { ProgressLogger } from './progress_logger';

export function createLogReporter(testState$) {
  const progress = new ProgressLogger();

  const initialState$ = testState$
    .filter(state => state.started)
    .first()
    .do(state => progress.start(state.total));

  /**
   *  Provides a single value, the final state of the tests, then
   *  completes
   *
   *  @type {Rx.Observable}
   */
  const finalState$ = testState$
    .filter(state => state.complete)
    .first();

  /**
   *  Sends console.foo() calls to the progress logger
   *  @type {Rx.Observable}
   */
  const consoleCallLogging$ = testState$
    .map(state => state.consoleCalls && state.consoleCalls[state.consoleCalls.length - 1])
    .distinctUntilChanged()
    .takeUntil(finalState$)
    .filter(Boolean)
    .do(call => {
      progress.consoleCall(call.method, call.args);
    });

  /**
   *  Logs a progress indicator to the console for each test added
   *  to the tests state
   *
   *  @type {Rx.Observable}
   */
  const testLogging$ = testState$
    .mergeMap(state => state.tests)
    .groupBy(test => test.id)
    .mergeMap(group => group.distinctUntilChanged())
    .takeUntil(finalState$)
    .do(test => {
      progress.testUpdate(test);
    });

  /**
   *  Represents the all progress logging
   *  @type {Rx.Observable}
   */
  const progressLogging$ = consoleCallLogging$
    .merge(testLogging$)
    .do({
      complete() {
        progress.end();
      }
    });

  /**
   *  Logs a failure indicator for all failed tests after the final
   *  state is chosen
   *
   *  @type {Rx.Observable}
   */
  const failures$ = finalState$
    .mergeMap(state => state.tests)
    .do(createLogFailureObserver());

  /**
   *  Logs a summary about execution after the failure logs
   *
   *  @type {Rx.Observable}
   */
  const summary$ = failures$
    .ignoreElements()
    .concat(finalState$)
    .do({
      next(state) {
        console.log('  pass:', state.stats.passes);
        console.log('  fail:', state.stats.failures);
        console.log('  pending:', state.stats.pending);
        console.log('  total:', state.stats.tests);
        console.log('------------------');
        console.log('');
      }
    });

  /**
   *  Simple class exposes a promise that resolves
   *  once the tests are complete and the reporter is
   *  done reporting about them
   */
  return new class Reporter {
    async done() {
      await initialState$
        .merge(progressLogging$)
        .merge(failures$)
        .merge(summary$)
        .toPromise();
    }
  };
}