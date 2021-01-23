export function patch(oldVnode, vnode) {
  //创建组件的真实dom也会走这里，组件是没有el的属性的 所以这里的oldVnode是空的
  if (!oldVnode) {
    //没有则直接创建真实dom
    return createElement(vnode);
  }
  if (oldVnode.nodeType == '1') {
    //是真实dom，此时需将vnode生成真实dom，然后插入相关位置，再将老的dom删除
    let ele = createElement(vnode);

    let parentElm = oldVnode.parentNode;

    parentElm.insertBefore(ele, oldVnode.nextSibling);

    parentElm.removeChild(oldVnode);

    return ele;

  }
}

function createElement(vnode) {
  let {tag, data, text, children, vm} = vnode;
  if (typeof tag == 'string') {
    //是标签，也有可能是组件，这里需要先尝试创建一下组件，看看能不能创建成功
    if (createComponent(vnode)) {
      return vnode.componentInstance.$el;
    }
    vnode.el = document.createElement(tag);
    children.forEach(child => {
      vnode.el.appendChild(createElement(child));
    });
  } else {
    //是文本
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

function createComponent(vnode) {
  let i = vnode.data;
  //看看data属性上是否有hook，且hook上是否有init方法，
  //如果有则执行init方法；init上已经定义过$mount渲染方法了
  if ((i = i.hook) && (i = i.init)) {
    i(vnode);   //$mount方法执行完毕后，会在vm上挂载$el真实节点属性
  }
  if (vnode.componentInstance) {
    // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
    return true;
  }
  return false;
}