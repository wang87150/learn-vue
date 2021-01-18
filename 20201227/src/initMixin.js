import { compileToFunction } from "./compile/index";
import { mountComponent } from "./lifecycle";
import Watcher from "./observe/watcher";
import initStates from "./state";

export default initMixin;

function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;  //将当前的this对象--Vue实例  赋值给vm
    vm.$options = options || {};  //新增$options属性，
    initStates(vm); //初始化状态，包括props methods data computed watch等属性
    
    //编译模板
    if (options.el) {
      this.$mount(options.el);
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    if (!options.render) {
      //render的优先级比el高
      el = document.querySelector(el);
      vm.$el = el;
      let template = options.template;
      if(!template && el) {
        template = el.outerHTML;
      }
      options.render = compileToFunction(template);
    }

    mountComponent(vm, el);
  }

  Vue.prototype.$watch = function(name, handler, options = {}) {
    //这里开始new Watcher  这里需要标识是用户watcher，表示是用户自己创建的watcher
    options.user = true;
    new Watcher(this, name, handler, options);
  }
}