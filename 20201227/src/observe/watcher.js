import { popTarget, pushTarget } from "./dep";
import { queueWatchers } from "./scheduler";

let uid = 0;

class Watcher {
  constructor(vm, updateOrFn, afterUpdate, options) {
    this.uid = uid++;
    this.vm = vm;
    this.updateOrFn = updateOrFn;
    this.cb = afterUpdate;
    this.options = options;
    this.user = !!options.user;  //双重否定赋值给user-boolean 类型
    this.lazy = !!options.lazy;  //双重否定赋值给user-boolean 类型
    this.dirty = !!options.lazy;
    if (typeof updateOrFn === 'string') {
      //如果是字符串类型，
      this.getter = function() {
        let names = updateOrFn.split('.');
        return names.reduce((preV, curV) => {
          return preV[curV]
        }, vm);
      }
    } else {
      this.getter = updateOrFn; //执行它 会加载变量数据，到变量的get方法
    }
    
    this.deps = [];       //收集deps，主要是为了计算watcher跟watch使用。
    this.depIds = [];      //手机dep的id，防止重复添加

    //默认加载一次
    this.value = options.lazy ? undefined : this.get();
  }

  get() {
    pushTarget(this);//将当前的watcher存放到dep中
    let newValue = this.getter.call(this.vm);
    popTarget();  //取出watcher
    
    return newValue;
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

  depend() {
    let i = this.deps.length;
    while(i--) {
      let dep = this.deps[i];
      dep.depend();
    }
  }

  update() {
    //vue中的更新是异步的，等待所有的变量赋值完毕后，一把更新
    //---所以需要先将watcher缓存起来，最后在调用run方法
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatchers(this);
    }
    
  }

  evaluate() {
    this.dirty = false;
    this.value = this.get();
  }

  run() {
    let newValue = this.get();
    let oldValue = this.value;
    if (this.user) {
      //如果是用户watcher，执行回调
      this.cb.call(this.vm, newValue, oldValue);
    }
    this.value = newValue;
  }
};

export default Watcher;