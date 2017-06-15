import { inspect } from 'util';

export function inspectRemoteObject(remoteObject) {
  return inspect(remoteObject.preview || remoteObject.value, {
    colors: true,
    depth: null
  });
}
