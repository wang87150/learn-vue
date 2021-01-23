import {isObject} from './index.js';
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

const tactics = {};
let lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
]

lifeCycleHooks.forEach(lifeCycle => {
  tactics[lifeCycle] = mergeHook;
})

tactics.components = function(parentV, childV) {
  let options = Object.create(parentV);   //通过原型创建
  if (childV) {
    //如果孩子有值，遍历孩子，将值赋给options
    for (let key in childV) {
      parentV[key] = childV[key];
    }
  }
  return options;
}

export default function mergeOption(parent, child) {
  const options = {};
  let parentKeys = Object.keys(parent);
  let childKeys = Object.keys(child);
  parentKeys.forEach(parentKey => {
    mergeField(parentKey);
  })

  childKeys.forEach(childKey => {
    //如果老的里面已经有这个字段了，则跳过
    if (!parent.hasOwnProperty(childKey)) {
      mergeField(childKey);
    }
  })

  function mergeField(key) {
    let parentV = parent[key];
    let childV = child[key];
    if (tactics[key]) {
      options[key] = tactics[key](parentV, childV)
    } else {
      if (isObject(parentV) && isObject(childV)) {
        options[key] = {...parentV, ...childV};
      } else {
        //如果新的没值，则直接赋老值 否则直接将新值赋给老值
        options[key] = childV ? childV : parentV;
      }
    }
  }
  return options;
}