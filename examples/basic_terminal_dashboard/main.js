const { auth, DefinitionCount } = require("@cob/dashboard-info")

function showCB(value, resultsUrl) {
    console.log(value)
}

async function start() {
    await auth("jestTests", "1jestTests2")
    new DefinitionCount("Test Person", showCB, 1 )
}

start()