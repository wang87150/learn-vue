import { popTarget, pushTarget } from "./dep";

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

    //默认加载一次
    this.get()
  }

  get() {
    pushTarget(this);//将当前的watcher存放到dep中
    this.getter();
    popTarget();  //取出watcher
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  update() {
    console.log('update');
    this.get();
  }
};

export default Watcher;