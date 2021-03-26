function showCB(info) {
    console.log(info.value)
}

async function main() {
    const dashInfo = await import("@cob/dashboard-info")

    dashInfo.setServer("https://learning.cultofbits.com") 
    await dashInfo.auth("jestTests", "1jestTests2")

    let total = dashInfo.definitionCount("Test Person", "*", {changeCB:showCB, validity:1} )
    showCB(totalInfo) // Show initial information
}

main()