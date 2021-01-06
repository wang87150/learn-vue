import { observe } from "./observe/index";
import { isFunction } from "./utils";

export default function initStates(vm) {
  if (vm.$options.data) initData(vm);  //初始化data属性
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    }
  })
}

function initData(vm) {
  let data = vm.$options.data;

  data = vm._data = isFunction(data) ? data() : data;
  // data = isFunction(data) ? data.call(vm) : data;
  console.log("data", data);

  //对data的第一层数据进行代理 使得vm.name === vm._data.name;

  for(let key in data) {
    proxy(vm, '_data', key);
  }

  //开始观测数据
  observe(data);
}