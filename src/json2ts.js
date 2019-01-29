const path = require('path')
const fs = require('fs-extra')
const rp = require('request-promise')
const cheerio = require('cheerio')
const outTs = require('./out-ts')
const util = require('../src/util')
const getInterfaceTitle = util.getInterfaceTitle

const convert = async ({ url, method, target, property }, adapter) => {
    target = path.join(process.cwd(), target)
    let resolvePage = adapter || getAllUrl

    let body = await rp({ url, method, json: true })
    if (typeof body === 'object') {
        outTs(target, body, property, getInterfaceTitle(url))
    } else {
        // reslove page, get url and method
        let $ = cheerio.load(body)
        let urls = resolvePage($)

        // get all urls response
        let jsons = await getAllResponseJson(url, urls)

        exportInterfaces(target, jsons, urls, property)
    }
}

const getAllUrl = $ => {
    let urlArr = []
    $('.list li a').each(function(index, elem) {
        let text = $(this).text()
        let execArr = /^(GET|POST|PUT|DELETE).*?(\/\S+)/g.exec(text)
        let [, method, url] = execArr
        urlArr.push({
            method,
            url
        })
    })

    return urlArr
}

const getAllResponseJson = async (root, urls) => {
    let promises = urls.map(
        async item =>
            await rp({
                method: item.method,
                uri: root + item.url,
                json: true
            })
    )

    return await Promise.all(promises)
}

const exportInterfaces = (target, jsons, urls, property) => {
    // before remove entire target folder
    fs.removeSync(target)

    jsons.forEach((json, index) =>
        outTs(target, json, property, getInterfaceTitle(urls[index].url))
    )
}
module.exports = convert
