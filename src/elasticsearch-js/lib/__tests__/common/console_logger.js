const Log = require('../../log');
const ConsoleLogger = require('../../loggers/console');
const expect = require('expect.js');
let parentLog;

beforeEach(function () {
  parentLog = new Log();
});

afterEach(function () {
  parentLog.close();
});

function makeLogger(parent, levels) {
  parent = parent || parentLog;
  const config = {
    levels: Log.parseLevels(levels || 'trace')
  };
  return new ConsoleLogger(parent, config);
}

describe('Console Logger', function () {
  const sandbox = require('sinon').sandbox.create();
  afterEach(() => sandbox.restore());

  require('../lib').genericLoggerTests(makeLogger);

  describe('', () => {
    let originalConsoleWarn;
    before(() => {
      originalConsoleWarn = console.warn;
      console.warn = null;
    });
    after(() => {
      console.warn = originalConsoleWarn;
    });

    it('checks before using unique logging functions, falls back to #log()', function () {
      sandbox.stub(console, 'log');
      const logger = makeLogger();
      logger.onWarning('message');
      expect(console.log.callCount).to.be(1);
    });
  });

});
