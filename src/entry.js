const request = require('request')
const json2ts = require('json2ts')
const fs = require('fs-extra')
const path = require('path')

const chalk = require('chalk')
const chalkError = chalk.red
const chalkSuccess = chalk.green

const writeFile = async (target, content) => {
    let outPath = path.resolve(__dirname, target + '/test.ts')
    await fs.outputFile(outPath, content)
    console.log(chalkSuccess(`ts interface success write。write path: ${outPath}`))
}

const convert = ({ url, target }) => {
    request(url, (error, response, body) => {
        if (json2ts.isJson(body)) {
            let tsContent = json2ts.convert(body)
            writeFile(target, tsContent)
        } else {
            console.log(chalkError('REST-Service has no valid JSON result.'))
        }
    })
}

module.exports = convert
