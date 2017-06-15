export function observeCompletion(observable) {
  return observable
    .materialize()
    .filter(e => e.kind === 'C')
    .first()
    .mapTo(true);
}