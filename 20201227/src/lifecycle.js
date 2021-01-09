import { patch } from "./vdom/patch";

export function mountComponent(vm, el) {
  
  //更新函数，后续数据变化 也可以走这个函数
  let updateComponent = () => {
    vm._update(vm._render(vm));   //将生成的虚拟dom 转化成真实dom
  }

  updateComponent();
}

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    //既有初始化，也有更新
    let vm = this;
    patch(vm.$el, vnode);
  }
}