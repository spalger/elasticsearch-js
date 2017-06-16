import Rx from 'rxjs/Rx';
import createCRI from 'chrome-remote-interface';

export async function withChromeRemote(chrome, url, block) {
  let remote;
  try {
    remote = await createCRI({ port: chrome.port });
    await Promise.all([
      remote.Page.enable(),
      remote.Runtime.enable(),
    ]);

    console.log('navigating to', url);
    remote.Page.navigate({ url });

    await Rx.Observable
      .fromEvent(remote, 'Page.frameNavigated')
      .first()
      .toPromise();

    await block(remote);
  } finally {
    if (remote) {
      await remote.close();
    }
  }
}