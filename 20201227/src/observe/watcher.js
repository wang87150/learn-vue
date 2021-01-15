import { popTarget, pushTarget } from "./dep";
import { queueWatchers } from "./scheduler";

let uid = 0;

class Watcher {
  constructor(vm, updateOrFn, afterUpdate, options) {
    this.uid = uid++;
    this.vm = vm;
    this.updateOrFn = updateOrFn;
    this.afterUpdate = afterUpdate;
    this.options = options;
    this.getter = updateOrFn; //执行它 会加载变量数据，到变量的get方法
    this.deps = [];       //收集deps，主要是为了计算watcher跟watch使用。
    this.depIds = [];      //手机dep的id，防止重复添加

    //默认加载一次
    this.get()
  }

  get() {
    pushTarget(this);//将当前的watcher存放到dep中
    this.getter();
    popTarget();  //取出watcher
  }

  addDep(dep) {
    let depId = dep.uid;
    if (!this.depIds.includes(depId)) {
      //没有添加过，
      this.deps.push(dep);
      this.depIds.push(depId);
      dep.addWatcher(this);
    }
  }

  update() {
    //vue中的更新是异步的，等待所有的变量赋值完毕后，一把更新
    //---所以需要先将watcher缓存起来，最后在调用run方法
    queueWatchers(this);
  }

  run() {
    this.get();
  }
};

export default Watcher;