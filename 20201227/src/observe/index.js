import { isObject, isArray } from "../utils";
import { arrayMethods } from "./array";

export function observe(data) {
  //如果是对象才观测，否则直接return;
  if(!isObject(data)) return;
  // return new Observe(data);
  if (data.__ob__) return;
  new Observe(data);
}

class Observe {
  constructor(data) {
    data.__ob__ = this;
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    if (isArray(data)) {
      //如果是数组，则对数组中的每一项进行观测，同时重写数组中的变异方法如：push，unShift等（面向切面）
      data.__proto__ = arrayMethods;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  //观测对象
  walk(data) {
    //对data进行遍历劫持，使用Object.keys 可以避免遍历到原型链上的属性，不必再用hasOwnProperty来进行判断
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    })
  }
  //遍历观测数组中的每一项
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    })
  }
}


function defineReactive(data, key, value) {
  //因为对象的层级可能很深，也就是value也是一个对象，所以需要对value也进行遍历劫持
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newValue) {
      //因为set的值可能是个对象，也需要对其进行遍历劫持
      observe(newValue);
      value = newValue;
    }
  })
}