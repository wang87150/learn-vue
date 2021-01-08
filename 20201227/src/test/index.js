let a = "color: red;font-size: 12px;";

a.replace(/([^:;]\s*+)\:\s*([^:;]\s*+)/g, function() {
    console.log(arguments);
})

const html = `:class="main' 1 == 2 ? 'main1' : 'main2'" id = "app">Hello World!!!</div-a>`;
let arr = html.match(attribute);
console.log(arr);



let osVersion = "Ubuntu  82.10 aaa";//取出主版本号和次版本号  
let re = /^([a-z]*)+\s+(\d+).(\d+)/i;//.是正则表达式元字符之一,若要用它的字面意义须转义  
// let arr = re.exec(osVersion); 
let arr = osVersion.match(re);
console.log(arr)



let aa = [1,2,3,4,5,6,7,8];
let bb = aa.splice(-0, 0, ['a', 'b', 'c']);
console.log(aa);
console.log(bb);


function paserObj(arr) {
  if (!Array.isArray(arr) || arr.length < 2) {
    return;
  }
  let key = arr[0];
  if (arr.length == 2) {
    return {
      [key]: arr[1]
    }
  }
  return {
    [key]: pasetObj(arr.splice(1))
  }
}

console.log(paserObj(['a', 'b', 'c', 'd', 'e']))

let arrr = ['a', 'b', 'c', 'd', 'e'];
let obj = {}
let aa = arrr.reduce((total, item, index, list) => {
   
  total[item] = {}
  return total[item];
}, obj);

console.log(obj)
