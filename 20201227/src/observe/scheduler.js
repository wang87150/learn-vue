import { nextTick } from "../util/index.js";

let pending = false;
let ids = [];
let queue = [];

function flushSchedule() {
  queue.forEach(watcher => {
    watcher.run();
  })
}

export function queueWatchers(watcher) {
  let id = watcher.uid;
  if (!ids.includes(id)) {
    //没有存过这个watcher，将他存起来
    queue.push(watcher);
    ids.push(id);
    if (!pending) {
      nextTick(flushSchedule, 0);
      pending = true;
    }
  }
}