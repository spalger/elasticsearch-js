export function observePageConsole(pageEvents$) {
  return pageEvents$
    .filter(event => event.type === 'console');
}