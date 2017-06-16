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

const getTitleHierarchy = (test) => {
  if (test.parent) {
    return [...getTitleHierarchy(test.parent), test.title];
  }
  return [test.title];
};

runner.on('test end', (test) => {
  sendMsg({
    type: 'runner:test end',
    payload: {
      type: test.type,
      title: test.title,
      path: getTitleHierarchy(test.parent).map(t => t.trim()).filter(Boolean),
      speed: test.speed,
      state: test.state,
      duration: test.duration,
      pending: test.pending,
      error: !test.err ? null : {
        message: test.err.message,
        stack: test.err.stack,
      },
    }
  });
});

runner.on('end', () => {
  sendMsg({
    type: 'runner:end',
    payload: {
      stats: runner.stats
    }
  });
});