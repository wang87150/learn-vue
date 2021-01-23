import Watcher from "./observe/watcher";
import { patch } from "./vdom/patch";

export function mountComponent(vm, el) {
  
  //更新函数，后续数据变化 也可以走这个函数
  let updateComponent = () => {
    vm._update(vm._render(vm));   //将生成的虚拟dom 转化成真实dom
  }

  callHooks(vm, 'beforeMount');
  new Watcher(vm, updateComponent, () => {
    console.log('我更新了');
  }, {});
  callHooks(vm, 'mounted');
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    //既有初始化，也有更新
    let vm = this;
    vm.$el = patch(vm.$el, vnode);
  }
}

export function callHooks(vm, hookName) {
  let hookCbs = vm.$options[hookName];
  if (!hookCbs) return;
  hookCbs.forEach(hookCb => {
    hookCb.call(vm);
  })
}