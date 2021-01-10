import { watch } from "rollup";
import { queueWatchers } from "./scheduler";

let uid = 0;

class Dep {
  constructor() {
    this.uid = uid++;
    this.watchers = [];  //收集
    this.ids = [];
  }
  addWatcher(watcher) {
    let id = watcher.uid;
    if (!this.ids.includes(id)) {
      //如果没有存放，则开始存放，并且将id也存入ids中
      this.watchers.push(watcher);
      watcher.addDep(this);
      this.ids.push(id);
    }
  }
  notify() {
    //vue中的更新是异步的，等待所有的变量赋值完毕后，一把更新
    //---所以需要先将watcher缓存起来，最后在调用run方法
    queueWatchers(this);
  }
  run() {
    this.watchers.forEach(watcher => {
      watcher.update();
    })
  }
}

Dep.target = null;
export function pushTarget(watcher) {
  Dep.target = watcher;
}
export function popTarget() {
  Dep.target = null;
}

export default Dep;
