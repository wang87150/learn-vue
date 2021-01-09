
import {parseHtml} from './parser.js'
import {generate} from './generate.js'


export function compileToFunction(template) {
  let ast = parseHtml(template);  //编译模板 生成ast树  
  /**
   * {
   *  tag: 'div',
   *  attrs: [{name: 'id', value: 'app'}, {name: 'style', value: {color: red ; font-size: 12px ;}],
   *  parent: null,
   *  text: '',
   *  type: 1,    //1-节点；3-文本
   *  children: []
   * }
   */
  let code = generate(ast);       //将ast树生成render函数字符串
  /** _c(标签，属性，孩子)
   * _c('div', {id: 'app', :class: 'main', style: {"color":"red "," font-size":"12px "}}, 
   *  _c('h1', undefine, _v("" + _s(msg) + "")))
   */
  let render = new Function(`with(this){return ${code}}`);
  return render;
}