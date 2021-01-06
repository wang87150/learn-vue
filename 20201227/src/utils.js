export function isFunction(obj) {
  return typeof obj === 'function';
}

export function isObject(obj) {
  return typeof obj === 'object' && obj !== null;
}

export function isArray(obj) {
  return Array.isArray(obj);
}