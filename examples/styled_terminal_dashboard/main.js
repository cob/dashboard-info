const { auth, DefinitionCount } = require("@cob/dashboard-info")

const logUpdate = require('log-update')
const chalk = require('chalk');
const CFonts = require('cfonts');
const terminalLink = require('terminal-link')

function showCB(value, resultsUrl) {
    logUpdate(
        chalk.green.bold("Number of test persons:\n")
        + CFonts.render(" "+value, {colors: [value>6 ? 'red' : value > 4 ? 'yellow' : 'green', 'system']}).string
        + (resultsUrl != '' ? ("\n     " + terminalLink(chalk.blue("(results)"), resultsUrl)) : "")
    )
}

async function start() {
    await auth("jestTests", "1jestTests2")
    new DefinitionCount("Test Person", showCB, 1 )
}

start()