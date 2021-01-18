const arr = ['a', 'b', 'c', 'd'];
const obj = arr.reduceRight((preV, curV) => {
  return {
    [curV]: preV
  }
})
const c = 'a.b.c';
const value = (c.split('.')).reduce((preV, curV) => {
  if (preV.hasOwnProperty(curV)) {
    return preV[curV]
  }
  return obj[preV][curV]
}, obj)
console.log('value', value);