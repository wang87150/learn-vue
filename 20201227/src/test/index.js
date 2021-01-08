const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


let str = "hello {{arr}} World {{brr}} !!!";

let match;
while(match = defaultTagRE.exec(str)) {
  console.log('--------------------')
  console.log(match)
}