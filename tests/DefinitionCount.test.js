/** @jest-environment node */ //For auth
import definitionCount from "../src/DefinitionCount.js"
import { auth, rmAddInstance, rmDeleteInstance } from "@cob/rest-api-wrapper"


test('for learning app, "countries series" count for "Arab world" is 20', () => {
    definitionCount("Countries Series", "Arab world" )
    .then( results => {
        expect(results.value).toBe(20)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
    })
})



const sleep = (t) => new Promise (resolve => setTimeout(() => resolve(),t))


test('if we add another instance then there should be 1 more', async () => {
    let random = Math.floor(Math.random() * 1000)
    await auth({ username:"jestTests", password:"1jestTests2" })
    await definitionCount("Test Person", "DefinitionCount Test_"+random)
    .then( results => {
        expect(results.value).toBe(0)
    })


    let newId
    await rmAddInstance("Test Person", {"Name": "DefinitionCount Test_"+random}).then( result => newId = result.id)
    await sleep(800) // Wait for ES indexing
    await definitionCount("Test Person", "DefinitionCount Test_"+random)
    .then( results => {
        expect(results.value).toBe(1)
    })


    await rmDeleteInstance(newId)
    await sleep(800) // Wait for ES indexing
    await definitionCount("Test Person", "DefinitionCount Test_"+random)
    .then( results => {
        expect(results.value).toBe(0)
    })

})