describe('Logger Abstract', function () {
  const expect = require('expect.js');
  const Log = require('../../log');
  const LoggerAbstract = require('../../logger');

  let parentLog;

  function makeLogger(parent, levels) {
    return new LoggerAbstract(parent || parentLog, {
      levels: Log.parseLevels(levels || [])
    });
  }

  beforeEach(function () {
    parentLog = new Log();
  });

  afterEach(function () {
    parentLog.close();
  });

  describe('#write', function () {
    it('requires that it is overwritten', function () {
      expect(function () {
        const logger = makeLogger();
        logger.write();
      }).to.throwError(/overwritten/);
    });
  });

  require('../lib').genericLoggerTests(makeLogger);

});
