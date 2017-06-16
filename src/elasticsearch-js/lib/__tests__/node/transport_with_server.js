const Transport = require('../../transport');
const ConnectionPool = require('../../connection_pool');
const errors = require('../../errors');
const expect = require('expect.js');

const nock = require('../../../../test_mocks/server.js');
const through2 = require('through2');
const _ = require('lodash');

const sandbox = require('sinon').sandbox.create();
afterEach(() => sandbox.restore());

describe('Transport + Mock server', function () {
  describe('#request', function () {
    describe('server responds', function () {
      let serverMock;

      before(function () {
        serverMock = nock('http://localhost')
          .get('/give-me-400')
          .reply(400, 'sorry bub')

          .get('/give-me-404')
          .times(2)
          .reply(404, 'nothing here')

          .get('/give-me-500')
          .reply(500, 'ah shit')

          .get('/exists?')
          .reply(200, {
            status: 200
          })

          .get('/give-me-someth')
          .reply(200, '{"not":"valid', {
            'Content-Type': 'application/json'
          })

          .get('/')
          .reply(200, {
            'the answer': 42
          })

          .get('/huh?')
          .reply(530, 'boo')

          .get('/hottie-threads')
          .reply(200, [
            'he said',
            'she said',
            'he said',
            'she said',
            'he said',
            'she said'
          ].join('\n'), {
            'Content-Type': 'text/plain'
          });
      });

      after(function () {
        serverMock.done();
      });

      describe('with a 400 status code', function () {
        it('passes back a 400/BadRequest error', function (done) {
          const trans = new Transport({
            hosts: 'localhost'
          });

          trans.request({
            path: '/give-me-400'
          }, function (err, body, status) {
            expect(err).to.be.a(errors[400]);
            expect(err).to.be.a(errors.BadRequest);
            expect(body).to.eql('sorry bub');
            expect(status).to.eql(400);
            done();
          });
        });
      });

      describe('with a 404 status code', function () {
        describe('and castExists is set', function () {
          it('sends back false', function (done) {
            const trans = new Transport({
              hosts: 'localhost'
            });

            trans.request({
              path: '/give-me-404',
              castExists: true
            }, function (err, body, status) {
              expect(err).to.be(undefined);
              expect(body).to.eql(false);
              expect(status).to.eql(404);
              done();
            });
          });
        });
        describe('and the castExists param is not set', function () {
          it('sends back a 404/NotFound error', function (done) {
            const trans = new Transport({
              hosts: 'localhost'
            });

            trans.request({
              path: '/give-me-404'
            }, function (err, body, status) {
              expect(err).to.be.a(errors[404]);
              expect(err).to.be.a(errors.NotFound);
              expect(body).to.eql('nothing here');
              expect(status).to.eql(404);
              done();
            });
          });
        });
      });

      describe('with a 500 status code', function () {
        it('passes back a 500/InternalServerError error', function (done) {
          const trans = new Transport({
            hosts: 'localhost'
          });

          trans.request({
            path: '/give-me-500'
          }, function (err, body, status) {
            expect(err).to.be.a(errors[500]);
            expect(err).to.be.a(errors.InternalServerError);
            expect(body).to.eql('ah shit');
            expect(status).to.eql(500);
            done();
          });
        });
      });

      describe('with a 530 status code', function () {
        it('passes back a Generic error', function (done) {
          const trans = new Transport({
            hosts: 'localhost'
          });

          trans.request({
            path: '/huh?'
          }, function (err, body, status) {
            expect(err).to.be.a(errors.Generic);
            expect(body).to.eql('boo');
            expect(status).to.eql(530);
            done();
          });
        });
      });

      describe('with a 200 status code', function () {
        describe('and the castExists param is set', function () {
          it('sends back true', function (done) {
            const trans = new Transport({
              hosts: 'localhost'
            });

            trans.request({
              path: '/exists?',
              castExists: true
            }, function (err, body, status) {
              expect(err).to.be(undefined);
              expect(body).to.eql(true);
              expect(status).to.eql(200);
              done();
            });
          });
        });
        describe('with a partial response body', function () {
          it('sends back a serialization error', function (done) {
            const trans = new Transport({
              hosts: 'localhost'
            });

            trans.request({
              path: '/give-me-someth',
            }, function (err, body, status) {
              expect(err).to.be.a(errors.Serialization);
              expect(body).to.eql('{"not":"valid');
              expect(status).to.eql(200);
              done();
            });
          });
        });
        describe('with a valid response body', function () {
          it('sends back the body and status code with no error', function (done) {
            const trans = new Transport({
              hosts: 'localhost'
            });

            trans.request({
              path: '/',
            }, function (err, body) {
              expect(err).to.be(undefined);
              expect(body).to.eql({
                'the answer': 42
              });
              done();
            });
          });
        });
      });

      describe('with plain text', function () {
        it('notices the content-type header and returns the text', function (done) {
          const trans = new Transport({
            hosts: 'localhost'
          });

          trans.request({
            path: '/hottie-threads',
          }, function (err, body) {
            expect(err).to.be(undefined);
            expect(body).to.match(/s?he said/g);
            done();
          });
        });
      });
    });

    describe('return value', function () {
      it('resolves the promise it with the response body', function (done) {
        nock('http://esbox.1.com')
          .get('/')
          .reply(200, {
            good: 'day'
          });

        const tran = new Transport({
          hosts: 'http://esbox.1.com'
        });

        tran.request({}).then(function (resp) {
          expect(resp).to.eql({
            good: 'day'
          });
          done();
        }, done);
      });
    });

    describe('timeout', function () {
      it('clears the timeout when the request is complete', function () {
        const clock = sandbox.useFakeTimers('setTimeout', 'clearTimeout');
        const tran = new Transport({
          host: 'http://localhost:9200'
        });

        nock('http://localhost:9200')
          .get('/')
          .reply(200, {
            i: 'am here'
          });

        tran.request({}, function (err, resp, status) {
          expect(err).to.be(undefined);
          expect(resp).to.eql({ i: 'am here' });
          expect(status).to.eql(200);
          expect(_.keys(clock.timers)).to.have.length(0);
          clock.restore();
        });
      });

      it('timeout responds with a requestTimeout error', function (done) {
        const tran = new Transport({
          host: 'http://localhost:9200'
        });

        nock('http://localhost:9200')
          .get('/')
          .delay(1000)
          .reply(200, {
            i: 'am here'
          });

        tran.request({
          requestTimeout: 25
        }, function (err) {
          expect(err).to.be.a(errors.RequestTimeout);
          done();
        });
      });
    });

    describe('sniffOnConnectionFault', function () {
      it('schedules a sniff when sniffOnConnectionFault is set and a connection failes', function () {
        const clock = sandbox.useFakeTimers('setTimeout');

        nock('http://esbox.1.com')
          .get('/')
          .reply(200, function () {
            const str = through2(function (chunk, enc, cb) {
              cb(new Error('force error'));
            });

            setTimeout(function () {
              str.write('');
            }, 10);

            str.setEncoding = function () {}; // force nock's isStream detection
            return str;
          });

        sandbox.stub(ConnectionPool.prototype, '_onConnectionDied');
        sandbox.stub(Transport.prototype, 'sniff');
        const tran = new Transport({
          hosts: 'http://esbox.1.com',
          sniffOnConnectionFault: true,
          maxRetries: 0
        });

        expect(tran.connectionPool._onConnectionDied).to.not.be(ConnectionPool.prototype._onConnectionDied);

        tran.request({
          requestTimeout: Infinity
        })
        .then(function () {
          throw new Error('expected the request to fail');
        })
        .catch(function () {
          expect(ConnectionPool.prototype._onConnectionDied.callCount).to.eql(1);
          expect(tran.sniff.callCount).to.eql(0);
          expect(_.size(clock.timers)).to.eql(1);

          const timeout = _.values(clock.timers).pop();
          timeout.func();
          expect(tran.sniff.callCount).to.eql(1);
        });
      });
    });
  });
});
