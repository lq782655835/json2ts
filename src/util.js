const url = require('url')

const getInterfaceTitle = path => {
    if (path.startsWith('http')) {
        path = url.parse(path).path
    }
    let [, title] = /^\/(.*?)(\?|$)/.exec(path)
    return title.replace(/\//g, '-').replace(/:/g, '')
}

module.exports = {
    getInterfaceTitle
}
