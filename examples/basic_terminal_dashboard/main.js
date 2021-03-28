function showCB(info) {
    console.log(info.value)
}

async function main() {
    const {setServer, auth, definitionCount} = await import("@cob/dashboard-info")

    setServer("https://learning.cultofbits.com") 
    await auth({ username:"jestTests", password:"1jestTests2" })
    definitionCount("Test Person", "*", {changeCB:showCB, validity:1} )
}

main()