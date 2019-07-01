const path = require('path')
const fs = require('fs-extra')
const rp = require('request-promise')
const cheerio = require('cheerio')
const json2ts = require('json2ts')

const logger = require('./util/logger')
const getInterfaceTitle = require('../src/util/helper').getInterfaceTitle

const defaults = {
    url: '',
    method: 'get',
    target: './interfaces',
    property: ''
}

const convert = async (options, adapter) => {
    if (!options.url) {
        logger.log('error', { message: 'url can not be empty' })
        return
    }
    let mergeOptions = { ...defaults, ...options }
    let { url, method, target } = mergeOptions

    // 参数设置
    if (url.endsWith('/')) url = url.substring(0, url.length - 1)
    if (!path.isAbsolute) target = path.join(process.cwd(), target)

    // 请求url
    let body = await rp({ url, method, json: true })
    if (typeof body === 'object') {
        // 请求结果是接口，直接导出
        logger.log('debug', { message: 'single api', data: [mergeOptions] })
        exportTSFile(mergeOptions, body, url)
    } else {
        // 请求结果是nei页面，解析page
        logger.log('debug', { message: 'resolve page api', data: [mergeOptions] })
        let $ = cheerio.load(body)
        let resolvePage = adapter || getAllUrl // 可自定义扩展resolve page
        let urls = resolvePage($)

        exportInterfaces(mergeOptions, urls) // 导出ts interface文件
        exportServerAPI(urls) // 导出api模板文件
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

const exportInterfaces = async (options, urls) => {
    let { target, url } = options
    // remove entire target folder
    fs.removeSync(target)
    logger.log('debug', { message: `remove target folder: ${target}` })

    let jsons = await getAllResponseJson(url, urls)
    jsons.forEach((json, index) => exportTSFile(options, json, urls[index].url))
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

const exportTSFile = async (options, json, url) => {
    if (!json) return

    // export数据
    let { target, property } = options
    if (property) json = json[property] || ''
    let outString = json2ts.convert(JSON.stringify(json))

    // export路径
    let title = getInterfaceTitle(url)
    let outPath = path.join(target, title + '.ts')

    await fs.outputFile(outPath, outString)
    logger.log('info', { message: `ts interface success write。path: ${outPath}` })
}

const exportServerAPI = async urls => {
    const getServiceNameByRule = (url, method) => {
        let title = getInterfaceTitle(url)
        let upperCaseArr = title.split('-').map(str =>
            str.replace(/^\S/, function(s) {
                return s.toUpperCase()
            })
        )
        return method.toLowerCase() + upperCaseArr.join('')
    }

    let prefix = [`import http from '../http'`]
    let resultString = prefix
        .concat(
            urls.map(({ url, method }) => {
                return `export const ${getServiceNameByRule(url, method)} = data =>
    http({
        url: \`${url}\`,
        method: \`${method}\`,
        data
    })`
            })
        )
        .join('\n\n')

    let outPath = './serverAPI.ts'
    await fs.outputFile(outPath, resultString)
    logger.log('info', { message: `ts server api success write。path: ${outPath}` })
}

module.exports = convert
