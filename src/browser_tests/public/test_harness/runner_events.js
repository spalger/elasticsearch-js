const events = window.__runnerEvents__ = window.__runnerEvents__ || [];

export function send(event) {
  if (events.length && typeof events[0] === 'function') {
    events.shift()(event);
  } else {
    events.push(event);
  }
}

function getTitleHierarchy(test) {
  if (test.parent) {
    return [...getTitleHierarchy(test.parent), test.title];
  }
  return [test.title];
}

let testIdCounter = 0;
const testIdHistory = new WeakMap();
function getTestId(test) {
  if (!testIdHistory.has(test)) {
    testIdHistory.set(test, testIdCounter++);
  }
  return testIdHistory.get(test);
}

function serializeTest(test) {
  return {
    id: getTestId(test),
    type: test.type,
    title: test.title,
    path: getTitleHierarchy(test.parent).map(t => t.trim()).filter(Boolean),
    speed: test.speed,
    state: test.state || 'starting',
    duration: test.duration,
    pending: test.pending,
    error: !test.err ? null : {
      message: test.err.message,
      stack: test.err.stack,
    },
  };
}

export function attachToRunner(runner) {
  runner.on('start', () => {
    send({
      type: 'runner:start',
      payload: {
        total: runner.suite.total()
      }
    });
  });

  runner.on('test', (test) => {
    send({
      type: 'runner:test',
      payload: serializeTest(test)
    });
  });

  runner.on('test end', (test) => {
    send({
      type: 'runner:test',
      payload: serializeTest(test)
    });
  });

  runner.on('end', () => {
    send({
      type: 'runner:end',
      payload: {
        stats: runner.stats
      }
    });
  });
}