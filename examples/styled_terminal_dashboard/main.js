const logUpdate = require('log-update')
const chalk = require('chalk');
const CFonts = require('cfonts');
const terminalLink = require('terminal-link');

function showCB(updateInfo) {
    let value = updateInfo.value
    let href = updateInfo.href
    logUpdate(
        chalk.green.bold("Number of test persons:\n")
        + CFonts.render(" "+value, {colors: [value>6 ? 'red' : value > 4 ? 'yellow' : 'green', 'system']}).string
        + (href != '' ? ("\n     " + terminalLink(chalk.blue("(results)"), href)) : "")
    )
}

async function main() {
    const dashInfo = await import("@cob/dashboard-info")

    dashInfo.setServer("https://learning.cultofbits.com")
    await dashInfo.auth("jestTests", "1jestTests2")

    let totalInfo = dashInfo.definitionCount("Test Person","*", {changeCB:showCB, validity:1})
    showCB(totalInfo) // Show initial information
}

main()