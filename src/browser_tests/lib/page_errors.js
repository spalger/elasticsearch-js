export function observePageErrors(pageEvents$) {
  return pageEvents$
    .filter(event => event.type === 'exception')
    .map(event => {
      const error = new Error('browser exception');
      error.stack = event.payload.stack;
    });
}