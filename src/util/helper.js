const url = require('url')
const util = require('util')

exports.getInterfaceTitle = path => {
    if (path.startsWith('http')) {
        path = url.parse(path).path
    }
    let [, title] = /^\/(.*?)(\?|$)/.exec(path)
    return title.replace(/\//g, '-').replace(/:/g, '')
}

exports.getFormatTime = (format, time) => {
    time = time || new Date()

    let _doFormat = function(number) {
        if (number < 10) {
            return '0' + number
        }
        return number
    }
    let _doFormatMill = function(number) {
        if (number < 10) {
            return '00' + number
        }
        if (number < 100) {
            return '0' + number
        }
        return number
    }

    return util.format(
        format,
        time.getFullYear(),
        _doFormat(time.getMonth() + 1),
        _doFormat(time.getDate()),
        _doFormat(time.getHours()),
        _doFormat(time.getMinutes()),
        _doFormat(time.getSeconds()),
        _doFormatMill(time.getMilliseconds())
    )
}
