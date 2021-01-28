const VueLazyload = {
  install(Vue, options) {
    let lazyClass = createLazyClass(Vue);
    let lazy = new lazyClass(options);
    Vue.directive('lazy', {
      inserted: lazy.add.bind(lazy),
      unbind: lazy.remove.bind(lazy),
    })
  }
}

class Listen {
  constructor(lazy, el, src, isload) {
    this.lazy = lazy;
    this.el = el;
    this.src = src;
    this.isload = isload;
  }

  //为每个dom检查是否显示
  checkShow() {
    if (this.isload) {
      //如果已经加载过了，则不需要加载了
      return;
    }
    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;
    let {top, right, bottom, left} = this.el.getBoundingClientRect();
    console.log(top, left, right, bottom);

    let isShow = (top <= this.lazy.options.preload * innerHeight && bottom >= 0) && (left <= this.lazy.options.preload * innerWidth && right >= 0);
    if (isShow) {
      //需要加载
      this.el.load = true;
      this.isload = true;
      this.el.src= this.src;
      
    }
  }
}

function createLazyClass(Vue) {
  return class Lazy {
    constructor(options) {
      this.options = options || {};
      this.listens = [];
      this.isbind = false;
    }
    add(el, bindings) {
      //给滚动区域添加滚动事件
      Vue.nextTick(() => {
        let ele = findScrollEl(el);
        el.src = this.options.loading;
        let listen = new Listen(this, el, bindings.value, false);
        this.listens.push(listen);
        if (!this.isbind) {
          //没有绑定过事件 需要绑定一次
          console.log('ele', ele);
          let scrollHandler = createScrollHandler(this.scrollHandler.bind(this), 500);
          ele.addEventListener('scroll', scrollHandler, {passive: true});
          this.isbind = true;
          scrollHandler();
        }
      })
      
    }

    remove(el) {

    }

    scrollHandler() {
      console.log('scroll!!!');
      this.listens.forEach(l => {
        l.checkShow();
      })
    }
  }
}

const findScrollEl = (el) => {
  let parentEl = el.parentNode;
  while (parentEl) {
    //判断是否有scroll属性
    if (/auto/.test(getComputedStyle(parentEl)['overflow'])) {
      //如果能匹配到
      return parentEl;
    }
    parentEl = parentEl.parentNode;
  }
}

const createScrollHandler = (fn, delay) => {
  let startTime = null;
  let endTime = null;
  return function() {
    let context = this;
    let args = arguments;
    let cb = function() {
      fn.apply(context, args);
    }
    if (!startTime) {
      startTime = Date.now();
      setTimeout(cb, delay);
    } else {
      endTime = Date.now();
      if (endTime - startTime >= delay) {
        startTime = endTime;
        setTimeout(cb, delay);
      }
    }
  }
}

export default VueLazyload;