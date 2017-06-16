describe('Client instances creation', function () {
  const es = require('../../../elasticsearch');
  const apis = require('../../apis');
  const expect = require('expect.js');
  let client;

  const sandbox = require('sinon').sandbox.create();
  afterEach(() => sandbox.restore());

  describe('', function () {
    beforeEach(function () {
      client = new es.Client();
    });

    afterEach(function () {
      client.close();
    });

    it('throws an error linking to the es module when you try to instanciate the exports', function () {
      const Es = es;
      expect(function () {
        const c = new Es();
        return c;
      }).to.throwError(/previous "elasticsearch" module/);
    });

    const pkg = require('../../../../../package.json');
    const def = pkg.config.default_api_branch;
    const prev = pkg.config.supported_es_branches[pkg.config.supported_es_branches.indexOf(def) + 1];

    it('inherits the ' + def + ' API by default', function () {
      expect(client.bulk).to.be(apis[def].bulk);
      expect(client.nodes.stats).to.be(apis[def].nodes.prototype.stats);
    });

    it('inherits the ' + prev + ' API when specified', function () {
      client.close();
      client = new es.Client({
        apiVersion: prev
      });
      expect(client.bulk).to.be(apis[prev].bulk);
      expect(client.cluster.nodeStats).to.be(apis[prev].cluster.prototype.nodeStats);
    });

    it('closing the client causes it\'s transport to be closed', function () {
      let called = false;
      client.transport.close = function () {
        called = true;
      };
      client.close();
      expect(called).to.be(true);
    });

    it('creates a warning level logger by default', function () {
      expect(client.transport.log.listenerCount('error')).to.eql(1);
      expect(client.transport.log.listenerCount('warning')).to.eql(1);
      expect(client.transport.log.listenerCount('info')).to.eql(0);
      expect(client.transport.log.listenerCount('debug')).to.eql(0);
      expect(client.transport.log.listenerCount('trace')).to.eql(0);
    });
  });

  describe('#ping', function () {
    it('sets the default requestTimeout to 3000', function () {
      sandbox.stub(client.transport, 'request');
      client.ping();
      expect(client.transport.request.callCount).to.be(1);
      expect(client.transport.request.lastCall.args[0].requestTimeout).to.be(3000);
    });
  });
});
