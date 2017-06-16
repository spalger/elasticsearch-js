describe('Stdio Logger', function () {

  const Log = require('../../log');
  const StdioLogger = require('../../loggers/stdio');
  const expect = require('expect.js');
  let parentLog;

  const sandbox = require('sinon').sandbox.create();
  afterEach(() => sandbox.restore());

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
    return new StdioLogger(parent, config);
  }

  require('../lib').genericLoggerTests(makeLogger);

  describe('colorizing', function () {
    const chalk = require('chalk');
    const now = '2013-01-01T00:00:00Z';
    const nowDate = new Date(now);
    const nowTime = nowDate.getTime();

    beforeEach(function () {
      sandbox.useFakeTimers(nowTime);
    });

    it('uses colors when it\'s supported', function () {
      const logger = makeLogger();
      const hasColor = require('chalk').supportsColor;
      expect(logger.color).to.be(hasColor);
    });

    it('obeys the logger.color === false', function () {
      const logger = makeLogger();
      sandbox.stub(process.stdout, 'write');
      const withoutColor = 'Elasticsearch INFO: ' + now + '\n  something\n\n';

      logger.color = false;
      logger.onInfo('something');
      expect(process.stdout.write.lastCall.args[0]).to.eql(withoutColor);
    });

    it('obeys the logger.color === true', function () {
      const logger = makeLogger();

      sandbox.stub(process.stdout, 'write');
      const withoutColor = 'Elasticsearch DEBUG: ' + now + '\n  be weary\n\n';

      logger.color = true;
      logger.onDebug('be weary');
      expect(process.stdout.write.lastCall.args[0]).to.not.eql(withoutColor);
      expect(chalk.stripColor(process.stdout.write.lastCall.args[0])).to.eql(withoutColor);
    });
  });

});
