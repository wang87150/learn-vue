export function generate(root) {    //_c('div', {id: 'a', attr: 'b'}, 'Hello')
    console.log(root);

    let str = `_c('${root.tag}',${
        root.attrs.length ? getAttrStr(root.attrs) : 'undefine'
    })`

    return str;
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