import Rx from 'rxjs/Rx';

export function observePageTestResults(pageEvents$) {
  return new Rx.Observable(observer => {
    return pageEvents$.subscribe({
      next(event) {
        if (event.type === 'runner:end') {
          observer.next(event.payload);
          observer.complete();
          return;
        }
      },
      error(error) {
        observer.error(error);
      },
      complete() {
        observer.complete();
      }
    });
  });
}