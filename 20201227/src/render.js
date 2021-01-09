import { createElement, createTextElement } from "./vdom/index.js";

export function initRenderMixin(Vue) {
  Vue.prototype._render = function(vm) {
    let vnode = vm.$options.render.call(vm);
    return vnode;
  }

  Vue.prototype._c = function() {
    return createElement(this, ...arguments);
  }

  Vue.prototype._v = function(text) {
    return createTextElement(this, text);
  }

  Vue.prototype._s = function(value) {
    return typeof value === 'object' ? JSON.stringify(value) : value;
  }
}