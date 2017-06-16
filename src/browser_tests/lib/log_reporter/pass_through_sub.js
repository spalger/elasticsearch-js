export class PassThroughSub {
  constructor(destination) {
    this._destination = destination;
  }

  next(v) {
    this._destination.next(v);
  }

  error(error) {
    this._destination.error(error);
  }

  complete() {
    this._destination.complete();
  }
}