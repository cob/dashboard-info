/** @jest-environment node */                                                                                                                                                                                                                                                                //For auth
import definitionCount from "src/lib/DefinitionCount.js"
import sleep from "src/utils/Sleep.js"
import {auth, rmAddInstance, rmDeleteInstance} from "@cob/rest-api-wrapper"


test('for learning app, "countries series" count for "Arab world" is 20', async () => {
    const results = await definitionCount({definitionName: "Countries Series", query: "Arab world"})
    expect(results.value).toBe(20)
    expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
})

test('if we add another instance then there should be 1 more', async () => {
    const random = Math.floor(Math.random() * 1000)

    let results

    await auth({username: "jestTests", password: "1jestTests2"})
    results = await definitionCount({definitionName: "Test Person", query: "DefinitionCount Test_" + random})
    expect(results.value).toBe(0)

    let newId
    await rmAddInstance("Test Person", {"Name": "DefinitionCount Test_" + random}).then(result => newId = result.id)
    await sleep(800) // Wait for ES indexing

    results = await definitionCount({definitionName: "Test Person", query: "DefinitionCount Test_" + random})
    expect(results.value).toBe(1)

    await rmDeleteInstance(newId)
    await sleep(800) // Wait for ES indexing

    results = await definitionCount({definitionName: "Test Person", query: "DefinitionCount Test_" + random})
    expect(results.value).toBe(0)
})