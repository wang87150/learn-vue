let uid = 0;
class Dep {
  constructor() {
    this.uid = uid++;
    this.watchers = [];  //收集
  }
  depend() {
    if(Dep.target) {
      Dep.target.addDep(this);  //将dep添加进watcher中
    } else {
      // console.log('没有了');
    }
  }

  addWatcher(watcher) {
    this.watchers.push(watcher);
  }
  notify() {
    this.watchers.forEach(watcher => {
      watcher.update();
    })
  }
  run() {
    this.watchers.forEach(watcher => {
      watcher.update();
    })
  }
}

Dep.target = null;
const stack = [];
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length - 1];
}

export default Dep;
