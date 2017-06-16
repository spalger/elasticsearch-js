import { createLogFailureObserver } from './log_failure_observer';
import { createLogProgressOperator } from './log_progress_operator';

export function createLogReporter(testState$) {
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
   *  Logs a progress indicator to the console for each test added
   *  to the tests state
   *
   *  @type {Rx.Observable}
   */
  const progress$ = testState$
    .map(state => state.tests && state.tests[state.tests.length - 1])
    .distinctUntilChanged()
    .lift(createLogProgressOperator())
    .takeUntil(finalState$);

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
      await Promise.all([
        progress$.toPromise(),
        failures$.toPromise(),
        summary$.toPromise(),
      ]);
    }
  };
}