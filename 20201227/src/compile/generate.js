const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function generate(root) {    //_c('div', {id: 'a', attr: 'b'}, _v('Hello'))
    let children = getChildStr(root.children);  //'Hello' + arr + 'World'
    let str = `_c('${root.tag}',${
        root.attrs.length ? getAttrStr(root.attrs) : 'undefined'
    }${
        children ? `,${children}`: ''
    })`;

    return str;
}

function getChildStr(children) {
    let str = '';
    if (children) {
        return children.map(child => {
            return gen(child);
        }).join(',');
    }
    return false;
}

function gen(child) {
    if (child.type == '1') {
        return generate(child);
    }
    if (child.type == '3') {
        let text = child.text;
        if (!defaultTagRE.test(text)) {
            //匹配不到
            return `_v('${text}')`;
        } else {
            //能匹配到，需要用正则不停的匹配，分割字符串 //'Hello' + arr + 'World'
            let strs = [];
            let match;

            let lastIndex = defaultTagRE.lastIndex = 0;
            while(match = defaultTagRE.exec(text)) {
                let index = match.index;
                strs.push(JSON.stringify(text.slice(lastIndex, index)));
                lastIndex = index + match[0].length;
                strs.push(`_s(${match[1].trim()})`);
            }
            strs.push(JSON.stringify(text.slice(lastIndex)));
            return `_v(${strs.join('+')})`;
        }

        
    }
}

function getAttrStr(attrs) {
    let attrsStrs = attrs.map((item) => {
        if (item.name == 'style') {
            let styleObj = {};
            item.value.replace(/([^:;]+)\:\s*([^:;]+)/g, function() {
                styleObj[arguments[1]] = arguments[2];
            })
            return `style: ${JSON.stringify(styleObj)}`;
        }
        return `${item.name}:${JSON.stringify(item.value)}`;
    });
    return `{${attrsStrs.join(',')}}`
}