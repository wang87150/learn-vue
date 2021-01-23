import mergeOption from "./util/mergeOptions";

export function initGlobalMethods(Vue) {
  Vue.options = {};
  Vue.mixin = function(options) {
    this.options = mergeOption(this.options, options)
    return this;
  }

  //将自身挂载到options的_base属性上，后续每一个组件都能使用this.options._base拿到Vue
  Vue.options._base = Vue;    
  Vue.options.components = {};

  Vue.component = function(name, define) {
    define = this.options._base.extends(define);
    this.options.components[name] = define;
  }

  Vue.extends = function(define) {
    const Super = this;
    const Sub = function VueComponent(options) {
      this._init(options);
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOption(Super.options, define);
    return Sub;
  }
}