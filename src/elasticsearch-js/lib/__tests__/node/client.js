const stream = require('stream');
const util = require('util');
const es = require('../../../elasticsearch');

describe('client', () => {
  describe('config', function () {
    it('accepts a stream type logger', function (done) {
      function NullStream() {
        stream.Writable.call(this);
      }
      util.inherits(NullStream, stream.Writable);

      NullStream.prototype._write = function (/* chunk, encoding, next */) {
        done();
      };

      const client = new es.Client({
        log: [
          { type: 'stream', stream: new NullStream() }
        ]
      });

      client.transport.log.error(new Error());
    });
  });
});