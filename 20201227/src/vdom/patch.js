export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType == '1') {
    //是真实dom，此时需将vnode生成真实dom，然后插入相关位置，再将老的dom删除
    let ele = createElement(vnode);

    let parentElm = oldVnode.parentNode;

    parentElm.insertBefore(ele, oldVnode.nextSibling);

    parentElm.removeChild(oldVnode);

  }
}

function createElement(vnode) {
  let {tag, data, text, children, vm} = vnode;
  if (typeof tag == 'string') {
    //是标签，
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