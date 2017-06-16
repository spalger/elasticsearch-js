const _ = require('../../utils');
const expect = require('expect.js');

describe('Utils', function () {
  describe('#getUnwrittenFromStream', function () {
    it('ignores things that do not have writableState', function () {
      expect(_.getUnwrittenFromStream()).to.be(undefined);
      expect(_.getUnwrittenFromStream(false)).to.be(undefined);
      expect(_.getUnwrittenFromStream([])).to.be(undefined);
      expect(_.getUnwrittenFromStream({})).to.be(undefined);
    });

    if (require('stream').Writable) {
      const MockWritableStream = require('../../../../test_mocks/writable_stream');
      it('ignores empty stream', function () {
        const stream = new MockWritableStream();
        expect(_.getUnwrittenFromStream(stream)).to.be('');
      });

      it('returns only what is in the buffer', function () {
        const stream = new MockWritableStream();
        stream.write('hot');
        stream.write('dog');
        expect(_.getUnwrittenFromStream(stream)).to.be('dog');
      });
    }
  });
});