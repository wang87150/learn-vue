
import {parseHtml} from './parser.js'
import {generate} from './generate.js'


export function compileToFunction(template) {
  let ast = parseHtml(template);
  let code = generate(ast);
  console.log(code);
  return function() {}
}

