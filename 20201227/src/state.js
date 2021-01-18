import Dep from "./observe/dep";
import { observe } from "./observe/index";
import Watcher from "./observe/watcher";
import { isFunction } from "./utils";

export default function initStates(vm) {
  if (vm.$options.data) initData(vm);  //初始化data属性
  if (vm.$options.computed) initComputed(vm, vm.$options.computed);
  if (vm.$options.watch) initWatch(vm, vm.$options.watch);
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}

function initData(vm) {
  let data = vm.$options.data;

  // data = vm._data = isFunction(data) ? data() : data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;

  //对data的第一层数据进行代理 使得vm.name === vm._data.name;

  for(let key in data) {
    proxy(vm, '_data', key);
  }

  //开始观测数据
  observe(data);
}

function initWatch(vm, watchs) {
  let keys = Object.keys(watchs);
  keys.forEach(key => {
    if (Array.isArray(watchs[key])) {
      //如果是数组--watch可以写成数组的形式
      for (let i = 0; i < watchs[key].length; i++) {
        let handler = watchs[key][i];
        createWatch(vm, key, handler);
      }
    } else {
      let handler = watchs[key];
      createWatch(vm, key, handler);
    }
  })
}

function createWatch(vm, name, handler) {
  vm.$watch(name, handler); //需要扩展原型
}

function initComputed(vm, computeds) {
  let keys = Object.keys(computeds);
  const watcherMap = vm._computedWatcherMap = {};
  keys.forEach(key => {
    let userDef = computeds[key]; //用户定义的
    let getter = typeof userDef == 'function' ? userDef : userDef.get;
    let watcher = createComputed(vm, getter, ()=>{}, {lazy: true}); //创建computed
    watcherMap[key] = watcher;
    proxyComputed(vm, key, userDef);    //代理computed的属性到vm上
  })
}

function createComputed(vm, getter, cb, options) {
  return new Watcher(vm, getter, cb, options);
}

function proxyComputed(vm, key, userDef) {
  let shareProperty = {};
  // if (typeof userDef === 'function') {
  //   //如果是函数
  //   shareProperty.get = userDef;
  // } else {
  //   shareProperty.get = createComputedGetter(key);
  // }
  shareProperty.get = createComputedGetter(key);
  Object.defineProperty(vm, key, shareProperty)
}

function createComputedGetter(key) {
  return function computedGetter() {
    let watcher = this._computedWatcherMap[key];
    if (watcher.dirty) {
      console.log('sss');
      watcher.evaluate();
    }
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value;
  }
}