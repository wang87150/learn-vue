let arrr = ['a', 'b', 'c', 'd', 'e'];
let obj = {}
let aa = arrr.reduce((total, item, index, list) => {
   
  total[item] = {}
  return total[item];
}, obj);

console.log(obj)