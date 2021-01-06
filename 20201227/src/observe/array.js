let oldArrayMethods = Array.prototype;  //原来的数组原型链
export let arrayMethods = Object.create(oldArrayMethods);
//原理就是arrayMethods__proto__ = Array.prototype;  继承原来array的原型链

let methods = ["push", "unshift", "slice", "pop", "shift", "sort", "reverse"];

methods.forEach((method) => {
  //同时调用原来的原型链方法
  arrayMethods[method] = function (...args) {
    oldArrayMethods[method].call(this, ...args);

    let ob = this.__ob__;
    let insertItems;
    //对数组中新增的项  继续进行观测
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
  }
})