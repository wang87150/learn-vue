(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; //标签名

    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
    var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

    var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

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

    function parseHtml(html) {
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

      return root;
    }

    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
    function generate(root) {
      //_c('div', {id: 'a', attr: 'b'}, _v('Hello'))
      var children = getChildStr(root.children); //'Hello' + arr + 'World'

      var str = "_c('".concat(root.tag, "',").concat(root.attrs.length ? getAttrStr(root.attrs) : 'undefine').concat(children ? ",".concat(children) : '', ")");
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
      var ast = parseHtml(template);
      var code = generate(ast);
      console.log(code);
      return function () {};
    }

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

    function isFunction(obj) {
      return typeof obj === 'function';
    }
    function isObject(obj) {
      return _typeof(obj) === 'object' && obj !== null;
    }
    function isArray(obj) {
      return Array.isArray(obj);
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
      };
    });

    function observe(data) {
      //如果是对象才观测，否则直接return;
      if (!isObject(data)) return; // return new Observe(data);

      if (data.__ob__) return;
      new Observe(data);
    }

    var Observe = /*#__PURE__*/function () {
      function Observe(data) {
        _classCallCheck(this, Observe);

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

    function defineReactive(data, key, value) {
      //因为对象的层级可能很深，也就是value也是一个对象，所以需要对value也进行遍历劫持
      observe(value);
      Object.defineProperty(data, key, {
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          //因为set的值可能是个对象，也需要对其进行遍历劫持
          observe(newValue);
          value = newValue;
        }
      });
    }

    function initStates(vm) {
      if (vm.$options.data) initData(vm); //初始化data属性
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
      var data = vm.$options.data;
      data = vm._data = isFunction(data) ? data() : data; // data = isFunction(data) ? data.call(vm) : data;
      //对data的第一层数据进行代理 使得vm.name === vm._data.name;

      for (var key in data) {
        proxy(vm, '_data', key);
      } //开始观测数据


      observe(data);
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this; //将当前的this对象--Vue实例  赋值给vm

        vm.$options = options || {}; //新增$options属性，

        initStates(vm); //初始化状态，包括props methods data computed watch等属性
        //编译模板

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
          var template = options.template;

          if (!template && el) {
            template = el.outerHTML;
          }

          options.render = compileToFunction(template);
        }
      };
    }

    function Vue(options) {
      this._init(options);
    }

    initMixin(Vue);

    return Vue;

})));
