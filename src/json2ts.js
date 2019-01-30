const path = require('path')
const fs = require('fs-extra')
const rp = require('request-promise')
const cheerio = require('cheerio')
const logger = require('./util/logger')
const exportTSFile = require('./export-tsfile')
const getInterfaceTitle = require('../src/util/helper').getInterfaceTitle

const convert = async (options, adapter) => {
    let defaults = {
        url: '',
        method: 'get',
        target: './interfaces',
        property: ''
    }
    options = { ...defaults, ...options }
    if (!options.url) {
        logger.log('error', { message: 'url can not be empty' })
        return
    }

    let { url, method, target, property } = options
    url = url.endsWith('/') ? url.substring(0, url.length - 1) : url
    target = path.join(process.cwd(), target)
    let resolvePage = adapter || getAllUrl

    let body = await rp({ url, method, json: true })
    if (typeof body === 'object') {
        logger.log('debug', { message: 'single api', data: [{ target, property, url }] })

        exportTSFile(target, body, property, getInterfaceTitle(url))
    } else {
        logger.log('debug', { message: 'resolve page api', data: [{ target, property, url }] })

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
    logger.log('debug', { message: `remove target folder: ${target}` })

    jsons.forEach((json, index) =>
        exportTSFile(target, json, property, getInterfaceTitle(urls[index].url))
    )
}
module.exports = convert
