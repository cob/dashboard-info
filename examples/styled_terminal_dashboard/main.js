const logUpdate = require('log-update')
const chalk = require('chalk');
const CFonts = require('cfonts');
const terminalLink = require('terminal-link');
const {setServer, auth, definitionCount} = require("@cob/dashboard-info")

function showCB(updateInfo) {
    let value = updateInfo.value
    let href = updateInfo.href
    logUpdate(
        chalk.green.bold("Number of test persons:\n")
        + CFonts.render(" "+value, {colors: [value>6 ? 'red' : value > 4 ? 'yellow' : 'green', 'system']}).string
        + (href !== '' ? ("\n     " + terminalLink(chalk.blue("(results)"), href)) : "")
    )
}

async function main() {
    setServer("https://learning.cultofbits.com")
    await auth({ username:"jestTests", password:"1jestTests2" })
    definitionCount("Test Person", "*", {changeCB:showCB, validity:1} )
}

main()