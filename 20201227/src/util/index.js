let cbs = [];
let waiting = false;

function timer(cb) {
  Promise.resolve().then(() => {
    cb();
  })
}

function flushCallbacks() {
  cbs.forEach(cb => {
    cb();
  })
  waiting = true;
}

export function nextTick(cb, delay = 0) {
  if (typeof cb == 'function') {
    cbs.push(cb);
    if (!waiting) {
      timer(flushCallbacks);
    }
  }
}