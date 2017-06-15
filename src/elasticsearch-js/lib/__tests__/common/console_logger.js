const Log = require('../../log');
const ConsoleLogger = require('../../loggers/console');
const sinon = require('sinon');
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

require('../../../../test_utils/auto_release_stub').make();

describe('Console Logger', function () {

  require('../lib').genericLoggerTests(makeLogger);

  it('checks before using unique logging functions, falls back to #log()', function () {
    const _warning = console.warn;
    console.warn = null;
    sinon.stub(console, 'log');

    const logger = makeLogger();

    logger.onWarning('message');
    expect(console.log.callCount).to.be(1);

    console.warn = _warning;
    console.log.restore();
  });

});
