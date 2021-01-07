const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;    //标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function createElement(tagName, attrs) {
    return {
        tag: tagName,
        parent: null,
        children: [],
        attrs,
        type: 1,
        text: ''
    }
}

let stack = [];
let root = null;
//开始标签
function start(tagName, attrs) {
    
    let parent = stack[stack.length - 1];
    let element = createElement(tagName, attrs);
    if (!root) {
        root = element;
    }
    if (parent) {
        element.parent = parent;
        parent.children.push(element);
    }
    stack.push(element);
}

function end(tagName) {
    let last = stack.pop();
    if (last.tag !== tagName) {
        throw new Error('标签有误！！！！');
    }
}

function chars(text) {
    text = text.replace(/\s/g, "");
    let element = stack[stack.length - 1];
    if (text) {
        element.children.push({
            type: 3,
            text
        })
    }
}

export function parseHtml(html) {
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {

            //有可能是开始标签<div>   也有可能是结束标签</div>
            let startTagMatch = parseStartTag();
            if (startTagMatch) {
                //如果是开始标签
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }

            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }

        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function parseStartTag() {
        let mMatch = html.match(startTagOpen);
        if (mMatch) {
            //如果是开始标签
            const match = {
                tagName: mMatch[1],
                attrs: []
            }
            //然后截取字符串
            advance(mMatch[0].length);

            //然后再解析标签属性，
            let attr, end;
            //因为只能解析一个属性，所以需要使用while循环
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                //如果标签没有结束且有属性
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length);
            }
            if (end) {
                //匹配到结束标签
                advance(end[0].length);
            }
            return match;
        }
    }

    function advance(length) {
        html = html.substring(length);
    }

    return root;
}

