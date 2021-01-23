export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export function isArray(obj) {
  return Array.isArray(obj);
}

export function isReservedTag(tagName) {
  let reservedTag = 'a,div,span,p,img,button,ul,li,h1,h2,h3,h4,h5,h6,table,tr,td';
  return reservedTag.includes(tagName);
}