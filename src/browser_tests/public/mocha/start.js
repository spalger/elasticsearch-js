const runner = mocha.run();

const messages = window.__msgs__ = window.__msgs__ || [];
const queue = window.__msgq__ = window.__msgq__ || [];
const sendMsg = (msg) => {
  if (queue.length) {
    queue.shift()(msg);
  } else {
    messages.push(msg);
  }
};

runner.on('end', () => {
  sendMsg({
    type: 'runner:end',
    payload: {
      stats: runner.stats
    }
  });
});