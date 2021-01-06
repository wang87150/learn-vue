const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;    //标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


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
