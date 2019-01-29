#!/usr/bin/env node

const yargs = require('yargs')
const run = require('./src/json2ts')
const logger = require('./src/util/logger')

const args = yargs
.usage('Usage: $0 [options]')
.demandOption(['url'])
.describe('u', "your web url")
.alias('u', 'url')
.describe('m', 'your web url method')
.alias('m', 'method')
.describe('t', "typescript interface target folder path")
.alias('t', 'target')
.describe('p', 'export response property interface')
.alias('p', 'property')
.help('help')
.alias('h', 'help').argv

// auto run
;(async function() {
    try {
        await run({...args})
    } catch (err) {
        logger.log('error', {data: [err]})
    }
})()

