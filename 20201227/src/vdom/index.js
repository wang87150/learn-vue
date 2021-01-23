import { isReservedTag, isObject } from "../utils";

export function createElement(vm, tag, data = {}, ...children) {
  //这里的tag有可能是组件，所以需要先判断是否是原生标签还是组件
  if (isReservedTag(tag)) {
    //如果是原生标签，则直接生成真实dom
    return vnode(vm, tag, data, data.key, children, undefined);
  } else {
    //如果是组件，拿到组件定义，生成对象
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}

export function createTextElement(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text, undefined);
}

//创建组件的虚拟dom
function createComponent(vm, tagName, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    Ctor = vm.$options.base.extends(Ctor);
  }
  data.hook = {
    init(vnode) {
      let vm = vnode.componentInstance = new Ctor({_isComponent: true});
      vm.$mount();
    }
  }
  //组件是没有孩子与文本的
  return vnode(vm, `vue-component-${tagName}`, data, key, undefined, undefined, {Ctor, children});
}

function vnode(vm, tag, data, key, children, text, Ctor) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text
  }
}