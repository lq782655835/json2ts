#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require('chalk')
const run = require('./src/json2ts')

const args = yargs
.usage('Usage: $0 [options]')
.demandOption(['url'])
.describe('u', "your web url")
.alias('u', 'url')
.describe('m', 'your web url method')
.alias('m', 'method')
.default('m', 'get')
.describe('t', "typescript interface target folder path")
.alias('t', 'target')
.default('t', './interface')
.describe('p', 'export response property interface')
.alias('p', 'property')
.help('help')
.alias('h', 'help').argv

// auto run
;(async function() {
    try {
        await run({...args})
    } catch (err) {
        console.log(chalk.red(err))
    }
})()

