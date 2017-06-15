
import { Command } from 'commander';
import Rx from 'rxjs';

import {
  observeChrome,
  observeServer,
  observePageEvents,
  observePageTestResults,
  observePageErrors,
  observePageConsole,
  observeCompletion,
} from './lib';

const SECOND = 1000;
const MINUTE = SECOND * 60;

const cmd = new Command('node scripts/browser_tests');
cmd
  .description('Run browser tests in an instance of headless chrome');

const URL = 'http://localhost:8080';
const URLS = [
  URL + `/angular.html`,
  URL + `/browser.html`,
  URL + `/jquery.html`,
];

const main$ = Rx.Observable
  .combineLatest(
    observeChrome().do(() => console.log('started chrome')),
    observeServer(URL).do(() => console.log('started server at', URL))
  )
  .mergeMap(([ chrome, /* server */ ]) => {
    return Rx.Observable.from(URLS)
      .mergeMap(url => {
        const pageEvents$ = observePageEvents(chrome, url).share();
        const testResultsNoTimeout$ = observePageTestResults(pageEvents$).share();
        const testResults$ = Rx.Observable.merge(
          testResultsNoTimeout$,
          Rx.Observable.of(new Error('Timeout: tests took over 3 minutes to compelte'))
            .delay(3 * MINUTE)
            .mergeMap(Rx.Observable.throw)
            .takeUntil(observeCompletion(testResultsNoTimeout$)),
        ).share();

        observePageErrors(pageEvents$)
          .do(error => console.log('browser error', error.stack))
          .takeUntil(observeCompletion(testResults$));

        observePageConsole(pageEvents$)
          .do(event => console.log(`${event.payload.api}():`,...event.payload.args))
          .takeUntil(observeCompletion(testResults$));

        return testResults$
          .map(results => {
            console.log('test results', results);
          })
          .ignoreElements()
          .concat(Rx.Observable.of(url));
      }, null, 1);
  })
  .do(url => console.log('done with', url))
  .take(URLS.length);

main$.subscribe({
  error: error => {
    console.error('FATAL ERROR', error.stack);
  }
});