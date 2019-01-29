#!/usr/bin/env node

const yargs = require('yargs')
const chalk = require('chalk')
const run = require('./src/entry')

const args = yargs
.usage('Usage: $0 [options]')
.describe('t', "typescript interface target folder path")
.alias('t', 'target')
.default('t', './interface')
.describe('u', "your web url")
.alias('u', 'url')
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

