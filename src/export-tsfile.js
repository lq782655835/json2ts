const path = require('path')
const fs = require('fs-extra')
const json2ts = require('json2ts')
const chalk = require('chalk')
const chalkSuccess = chalk.green

module.exports = async (target, json, property, title = 'interface') => {
    let outPath = path.join(target, title + '.ts')

    if (!json) return
    if (property) json = json[property] || ''

    await fs.outputFile(outPath, json2ts.convert(JSON.stringify(json)))
    console.log(chalkSuccess(`ts interface success write。write path: ${outPath}`))
}
