(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  var cbs = [];
  var waiting = false;

  function timer(cb) {
    Promise.resolve().then(function () {
      cb();
    });
  }

  function flushCallbacks() {
    cbs.forEach(function (cb) {
      cb();
    });
    waiting = true;
  }

  function nextTick(cb) {

    if (typeof cb == 'function') {
      cbs.push(cb);

      if (!waiting) {
        timer(flushCallbacks);
      }
    }
  }
  function isObject(val) {
    return _typeof(val) == 'object' && val !== null;
  }

  function mergeHook(first, last) {
    if (last) {
      if (first) {
        return first.concat(last);
      } else {
        return [last];
      }
    } else {
      return first;
    }
  }

  var tactics = {};
  var lifeCycleHooks = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed'];
  lifeCycleHooks.forEach(function (lifeCycle) {
    tactics[lifeCycle] = mergeHook;
  });

  tactics.components = function (parentV, childV) {
    var options = Object.create(parentV); //通过原型创建

    if (childV) {
      //如果孩子有值，遍历孩子，将值赋给options
      for (var key in childV) {
        parentV[key] = childV[key];
      }
    }

    return options;
  };

  function mergeOption(parent, child) {
    var options = {};
    var parentKeys = Object.keys(parent);
    var childKeys = Object.keys(child);
    parentKeys.forEach(function (parentKey) {
      mergeField(parentKey);
    });
    childKeys.forEach(function (childKey) {
      //如果老的里面已经有这个字段了，则跳过
      if (!parent.hasOwnProperty(childKey)) {
        mergeField(childKey);
      }
    });

    function mergeField(key) {
      var parentV = parent[key];
      var childV = child[key];

      if (tactics[key]) {
        options[key] = tactics[key](parentV, childV);
      } else {
        if (isObject(parentV) && isObject(childV)) {
          options[key] = _objectSpread2(_objectSpread2({}, parentV), childV);
        } else {
          //如果新的没值，则直接赋老值 否则直接将新值赋给老值
          options[key] = childV ? childV : parentV;
        }
      }
    }

    return options;
  }

  function initGlobalMethods(Vue) {
    Vue.options = {};

    Vue.mixin = function (options) {
      this.options = mergeOption(this.options, options);
      return this;
    }; //将自身挂载到options的_base属性上，后续每一个组件都能使用this.options._base拿到Vue


    Vue.options._base = Vue;
    Vue.options.components = {};

    Vue.component = function (name, define) {
      define = this.options._base["extends"](define);
      this.options.components[name] = define;
    };

    Vue["extends"] = function (define) {
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOption(Super.options, define);
      return Sub;
    };
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
  function parseHtml(html) {
    function createElement(tagName, attrs) {
      return {
        tag: tagName,
        parent: null,
        children: [],
        attrs: attrs,
        type: 1,
        text: ''
      };
    }

    function parseStartTag() {
      var mMatch = html.match(startTagOpen);

      if (mMatch) {
        //如果是开始标签
        var match = {
          tagName: mMatch[1],
          attrs: []
        }; //然后截取字符串

        advance(mMatch[0].length); //然后再解析标签属性，

        var attr, _end; //因为只能解析一个属性，所以需要使用while循环


        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //如果标签没有结束且有属性
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (_end) {
          //匹配到结束标签
          advance(_end[0].length);
        }

        return match;
      }
    }

    function advance(length) {
      html = html.substring(length);
    }

    var stack = [];
    var root = null; //开始标签

    function start(tagName, attrs) {
      var parent = stack[stack.length - 1];
      var element = createElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      if (parent) {
        element.parent = parent;
        parent.children.push(element);
      }

      stack.push(element);
    }

    function end(tagName) {
      var last = stack.pop();

      if (last.tag !== tagName) {
        throw new Error('标签有误！！！！');
      }
    }

    function chars(text) {
      text = text.replace(/\s/g, "");
      var element = stack[stack.length - 1];

      if (text) {
        element.children.push({
          type: 3,
          text: text
        });
      }
    }

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        //有可能是开始标签<div>   也有可能是结束标签</div>
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          //如果是开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      }

      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    }

    return root;
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generate(root) {
    //_c('div', {id: 'a', attr: 'b'}, _v('Hello'))
    var children = getChildStr(root.children); //'Hello' + arr + 'World'

    var str = "_c('".concat(root.tag, "',").concat(root.attrs.length ? getAttrStr(root.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return str;
  }

  function getChildStr(children) {

    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }

    return false;
  }

  function gen(child) {
    if (child.type == '1') {
      return generate(child);
    }

    if (child.type == '3') {
      var text = child.text;

      if (!defaultTagRE.test(text)) {
        //匹配不到
        return "_v('".concat(text, "')");
      } else {
        //能匹配到，需要用正则不停的匹配，分割字符串 //'Hello' + arr + 'World'
        var strs = [];
        var match;
        var lastIndex = defaultTagRE.lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;
          strs.push(JSON.stringify(text.slice(lastIndex, index)));
          lastIndex = index + match[0].length;
          strs.push("_s(".concat(match[1].trim(), ")"));
        }

        strs.push(JSON.stringify(text.slice(lastIndex)));
        return "_v(".concat(strs.join('+'), ")");
      }
    }
  }

  function getAttrStr(attrs) {
    var attrsStrs = attrs.map(function (item) {
      if (item.name == 'style') {
        var styleObj = {};
        item.value.replace(/([^:;]+)\:\s*([^:;]+)/g, function () {
          styleObj[arguments[1]] = arguments[2];
        });
        return "style: ".concat(JSON.stringify(styleObj));
      }

      return "".concat(item.name, ":").concat(JSON.stringify(item.value));
    });
    return "{".concat(attrsStrs.join(','), "}");
  }

  function compileToFunction(template) {
    var ast = parseHtml(template); //编译模板 生成ast树  

    /**
     * {
     *  tag: 'div',
     *  attrs: [{name: 'id', value: 'app'}, {name: 'style', value: {color: red ; font-size: 12px ;}],
     *  parent: null,
     *  text: '',
     *  type: 1,    //1-节点；3-文本
     *  children: []
     * }
     */

    var code = generate(ast); //将ast树生成render函数字符串

    /** _c(标签，属性，孩子)
     * _c('div', {id: 'app', :class: 'main', style: {"color":"red "," font-size":"12px "}}, 
     *  _c('h1', undefine, _v("" + _s(msg) + "")))
     */

    var render = new Function("with(this){return ".concat(code, "}"));
    return render;
  }

  var uid = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.uid = uid++;
      this.watchers = []; //收集
    }

    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this); //将dep添加进watcher中
        }
      }
    }, {
      key: "addWatcher",
      value: function addWatcher(watcher) {
        this.watchers.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.watchers.forEach(function (watcher) {
          watcher.update();
        });
      }
    }, {
      key: "run",
      value: function run() {
        this.watchers.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var pending = false;
  var ids = [];
  var queue = [];

  function flushSchedule() {
    queue.forEach(function (watcher) {
      watcher.run();
    });
  }

  function queueWatchers(watcher) {
    var id = watcher.uid;

    if (!ids.includes(id)) {
      //没有存过这个watcher，将他存起来
      queue.push(watcher);
      ids.push(id);

      if (!pending) {
        nextTick(flushSchedule);
        pending = true;
      }
    }
  }

  var uid$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, updateOrFn, afterUpdate, options) {
      _classCallCheck(this, Watcher);

      this.uid = uid$1++;
      this.vm = vm;
      this.updateOrFn = updateOrFn;
      this.cb = afterUpdate;
      this.options = options;
      this.user = !!options.user; //双重否定赋值给user-boolean 类型

      this.lazy = !!options.lazy; //双重否定赋值给user-boolean 类型

      this.dirty = !!options.lazy;

      if (typeof updateOrFn === 'string') {
        //如果是字符串类型，
        this.getter = function () {
          var names = updateOrFn.split('.');
          return names.reduce(function (preV, curV) {
            return preV[curV];
          }, vm);
        };
      } else {
        this.getter = updateOrFn; //执行它 会加载变量数据，到变量的get方法
      }

      this.deps = []; //收集deps，主要是为了计算watcher跟watch使用。

      this.depIds = []; //手机dep的id，防止重复添加
      //默认加载一次

      this.value = options.lazy ? undefined : this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); //将当前的watcher存放到dep中

        var newValue = this.getter.call(this.vm);
        popTarget(); //取出watcher

        return newValue;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var depId = dep.uid;

        if (!this.depIds.includes(depId)) {
          //没有添加过，
          this.deps.push(dep);
          this.depIds.push(depId);
          dep.addWatcher(this);
        }
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          var dep = this.deps[i];
          dep.depend();
        }
      }
    }, {
      key: "update",
      value: function update() {
        //vue中的更新是异步的，等待所有的变量赋值完毕后，一把更新
        //---所以需要先将watcher缓存起来，最后在调用run方法
        if (this.lazy) {
          this.dirty = true;
        } else {
          queueWatchers(this);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.dirty = false;
        this.value = this.get();
      }
    }, {
      key: "run",
      value: function run() {
        var newValue = this.get();
        var oldValue = this.value;

        if (this.user) {
          //如果是用户watcher，执行回调
          this.cb.call(this.vm, newValue, oldValue);
        }

        this.value = newValue;
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    //创建组件的真实dom也会走这里，组件是没有el的属性的 所以这里的oldVnode是空的
    if (!oldVnode) {
      //没有则直接创建真实dom
      return createElement(vnode);
    }

    if (oldVnode.nodeType == '1') {
      //是真实dom，此时需将vnode生成真实dom，然后插入相关位置，再将老的dom删除
      var ele = createElement(vnode);
      var parentElm = oldVnode.parentNode;
      parentElm.insertBefore(ele, oldVnode.nextSibling);
      parentElm.removeChild(oldVnode);
      return ele;
    }
  }

  function createElement(vnode) {
    var tag = vnode.tag,
        data = vnode.data,
        text = vnode.text,
        children = vnode.children,
        vm = vnode.vm;

    if (typeof tag == 'string') {
      //是标签，也有可能是组件，这里需要先尝试创建一下组件，看看能不能创建成功
      if (createComponent(vnode)) {
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      children.forEach(function (child) {
        vnode.el.appendChild(createElement(child));
      });
    } else {
      //是文本
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function createComponent(vnode) {
    var i = vnode.data; //看看data属性上是否有hook，且hook上是否有init方法，
    //如果有则执行init方法；init上已经定义过$mount渲染方法了

    if ((i = i.hook) && (i = i.init)) {
      i(vnode); //$mount方法执行完毕后，会在vm上挂载$el真实节点属性
    }

    if (vnode.componentInstance) {
      // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
      return true;
    }

    return false;
  }

  function mountComponent(vm, el) {
    //更新函数，后续数据变化 也可以走这个函数
    var updateComponent = function updateComponent() {
      vm._update(vm._render(vm)); //将生成的虚拟dom 转化成真实dom

    };

    callHooks(vm, 'beforeMount');
    new Watcher(vm, updateComponent, function () {
      console.log('我更新了');
    }, {});
    callHooks(vm, 'mounted');
  }
  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      //既有初始化，也有更新
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  function callHooks(vm, hookName) {
    var hookCbs = vm.$options[hookName];
    if (!hookCbs) return;
    hookCbs.forEach(function (hookCb) {
      hookCb.call(vm);
    });
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }
  function isObject$1(obj) {
    return _typeof(obj) === 'object' && obj !== null;
  }
  function isArray(obj) {
    return Array.isArray(obj);
  }
  function isReservedTag(tagName) {
    var reservedTag = 'a,div,span,p,img,button,ul,li,h1,h2,h3,h4,h5,h6,table,tr,td';
    return reservedTag.includes(tagName);
  }

  var oldArrayMethods = Array.prototype; //原来的数组原型链

  var arrayMethods = Object.create(oldArrayMethods); //原理就是arrayMethods__proto__ = Array.prototype;  继承原来array的原型链

  var methods = ["push", "unshift", "slice", "pop", "shift", "sort", "reverse"];
  methods.forEach(function (method) {
    //同时调用原来的原型链方法
    arrayMethods[method] = function () {
      var _oldArrayMethods$meth;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayMethods$meth = oldArrayMethods[method]).call.apply(_oldArrayMethods$meth, [this].concat(args));

      var ob = this.__ob__;
      var insertItems; //对数组中新增的项  继续进行观测

      switch (method) {
        case 'push':
        case 'unshift':
          insertItems = args;
          break;

        case 'splice':
          insertItems = args.slice(2);
          break;
      }

      if (insertItems) ob.observeArray(insertItems);
      ob.dep.notify(); //通知watcher更新
    };
  });

  function observe(data) {
    //如果是对象才观测，否则直接return;
    if (!isObject$1(data)) return; // return new Observe(data);

    if (data.__ob__) return;
    return new Observe(data);
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      this.dep = new Dep();
      data.__ob__ = this;
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });

      if (isArray(data)) {
        //如果是数组，则对数组中的每一项进行观测，同时重写数组中的变异方法如：push，unShift等（面向切面）
        data.__proto__ = arrayMethods;
        this.observeArray(data);
      } else {
        this.walk(data);
      }
    } //观测对象


    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        //对data进行遍历劫持，使用Object.keys 可以避免遍历到原型链上的属性，不必再用hasOwnProperty来进行判断
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      } //遍历观测数组中的每一项

    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observe;
  }();

  function dependArray(value) {
    for (var i = 0; i < value.lengrh; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function defineReactive(data, key, value) {
    //因为对象的层级可能很深，也就是value也是一个对象，所以需要对value也进行遍历劫持
    var childOb = observe(value);
    var dep = new Dep();
    Object.defineProperty(data, key, {
      get: function get() {
        //取值时，将当前属性对应的watcher存放到属性自己的dep中
        dep.depend();

        if (childOb) {
          childOb.dep.depend();

          if (Array.isArray(value)) {
            dependArray(value);
          }
        }

        return value;
      },
      set: function set(newValue) {
        //因为set的值可能是个对象，也需要对其进行遍历劫持
        if (newValue !== value) {
          observe(newValue);
          value = newValue;
          dep.notify();
        }
      }
    });
  }

  function initStates(vm) {
    if (vm.$options.data) initData(vm); //初始化data属性

    if (vm.$options.computed) initComputed(vm, vm.$options.computed);
    if (vm.$options.watch) initWatch(vm, vm.$options.watch);
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; // data = vm._data = isFunction(data) ? data() : data;

    data = vm._data = isFunction(data) ? data.call(vm) : data; //对data的第一层数据进行代理 使得vm.name === vm._data.name;

    for (var key in data) {
      proxy(vm, '_data', key);
    } //开始观测数据


    observe(data);
  }

  function initWatch(vm, watchs) {
    var keys = Object.keys(watchs);
    keys.forEach(function (key) {
      if (Array.isArray(watchs[key])) {
        //如果是数组--watch可以写成数组的形式
        for (var i = 0; i < watchs[key].length; i++) {
          var handler = watchs[key][i];
          createWatch(vm, key, handler);
        }
      } else {
        var _handler = watchs[key];
        createWatch(vm, key, _handler);
      }
    });
  }

  function createWatch(vm, name, handler) {
    vm.$watch(name, handler); //需要扩展原型
  }

  function initComputed(vm, computeds) {
    var keys = Object.keys(computeds);
    var watcherMap = vm._computedWatcherMap = {};
    keys.forEach(function (key) {
      var userDef = computeds[key]; //用户定义的

      var getter = typeof userDef == 'function' ? userDef : userDef.get;
      var watcher = createComputed(vm, getter, function () {}, {
        lazy: true
      }); //创建computed

      watcherMap[key] = watcher;
      proxyComputed(vm, key); //代理computed的属性到vm上
    });
  }

  function createComputed(vm, getter, cb, options) {
    return new Watcher(vm, getter, cb, options);
  }

  function proxyComputed(vm, key, userDef) {
    var shareProperty = {}; // if (typeof userDef === 'function') {
    //   //如果是函数
    //   shareProperty.get = userDef;
    // } else {
    //   shareProperty.get = createComputedGetter(key);
    // }

    shareProperty.get = createComputedGetter(key);
    Object.defineProperty(vm, key, shareProperty);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatcherMap[key];

      if (watcher.dirty) {
        console.log('sss');
        watcher.evaluate();
      }

      if (Dep.target) {
        watcher.depend();
      }

      return watcher.value;
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; //将当前的this对象--Vue实例  赋值给vm

      vm.$options = options || {}; //新增$options属性，

      console.log('options', vm.constructor.options);
      vm.$options = mergeOption(vm.constructor.options, options);
      callHooks(vm, 'beforeCreate');
      initStates(vm); //初始化状态，包括props methods data computed watch等属性

      callHooks(vm, 'created'); //编译模板

      if (options.el) {
        this.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;

      if (!options.render) {
        //render的优先级比el高
        el = document.querySelector(el);
        vm.$el = el;
        var template = options.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        options.render = compileToFunction(template);
      }

      mountComponent(vm);
    };

    Vue.prototype.$watch = function (name, handler) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      //这里开始new Watcher  这里需要标识是用户watcher，表示是用户自己创建的watcher
      options.user = true;
      new Watcher(this, name, handler, options);
    };
  }

  function createElement$1(vm, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    //这里的tag有可能是组件，所以需要先判断是否是原生标签还是组件
    if (isReservedTag(tag)) {
      //如果是原生标签，则直接生成真实dom
      return vnode(vm, tag, data, data.key, children, undefined);
    } else {
      //如果是组件，拿到组件定义，生成对象
      var Ctor = vm.$options.components[tag];
      return createComponent$1(vm, tag, data, data.key, children, Ctor);
    }
  }
  function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  } //创建组件的虚拟dom

  function createComponent$1(vm, tagName, data, key, children, Ctor) {
    if (isObject$1(Ctor)) {
      Ctor = vm.$options.base["extends"](Ctor);
    }

    data.hook = {
      init: function init(vnode) {
        var vm = vnode.componentInstance = new Ctor({
          _isComponent: true
        });
        vm.$mount();
      }
    }; //组件是没有孩子与文本的

    return vnode(vm, "vue-component-".concat(tagName), data, key, undefined, undefined);
  }

  function vnode(vm, tag, data, key, children, text, Ctor) {
    return {
      vm: vm,
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function initRenderMixin(Vue) {
    Vue.prototype._render = function (vm) {
      var vnode = vm.$options.render.call(vm);
      return vnode;
    };

    Vue.prototype._c = function () {
      return createElement$1.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function (text) {
      return createTextElement(this, text);
    };

    Vue.prototype._s = function (value) {
      return _typeof(value) === 'object' ? JSON.stringify(value) : value;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);
  initRenderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalMethods(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
