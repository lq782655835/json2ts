#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require('chalk')
const run = require('./src/entry')

const args = yargs
.usage('Usage: $0 --url=url')
.describe('url', "your web url")
.describe('target', "target")
.default('target', './interface')
.demandOption(['url'])
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

