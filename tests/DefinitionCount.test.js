/** @jest-environment node */ //For auth
import { definitionCount } from "../src/Counts.js"
import { auth, rmAddInstance, rmDeleteInstance } from "@cob/rest-api-wrapper"


test('for learning app, "countries series" count for "Arab world" is 20', async () => {
    const results = await definitionCount({definitionName:"Countries Series", query:"Arab world"} )
    expect(results.value).toBe(20)
    expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20world")
})



const sleep = (t) => new Promise (resolve => setTimeout(() => resolve(),t))


test('if we add another instance then there should be 1 more', async () => {
    let random = Math.floor(Math.random() * 1000)
    await auth({ username:"jestTests", password:"1jestTests2" })
    await definitionCount({definitionName:"Test Person", query:"DefinitionCount Test_"+random})
    .then( results => {
        expect(results.value).toBe(0)
    })


    let newId
    await rmAddInstance("Test Person", {"Name": "DefinitionCount Test_"+random}).then( result => newId = result.id)
    await sleep(800) // Wait for ES indexing
    await definitionCount({definitionName:"Test Person", query:"DefinitionCount Test_"+random})
    .then( results => {
        expect(results.value).toBe(1)
    })


    await rmDeleteInstance(newId)
    await sleep(800) // Wait for ES indexing
    await definitionCount({definitionName:"Test Person", query:"DefinitionCount Test_"+random})
    .then( results => {
        expect(results.value).toBe(0)
    })

})

test('Count of "countries series" for arab world in 2018-07-10 should be 4, if passed with the matching timezone and 0 with a non-matching one', async () => {

    const with_tz = await definitionCount({definitionName:"Countries Series", query:"year.date:2018-07-10 Arab World", tz: "Europe/Lisbon"} )
    expect(with_tz.value).toBe(4)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date%3A2018-07-10%20Arab%20World")

    const wrong_tz = await definitionCount({definitionName:"Countries Series", query:"year.date:2018-07-10 Arab World", tz: "UTC"} )
    expect(wrong_tz.value).toBe(0)
    expect(wrong_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date%3A2018-07-10%20Arab%20World")

})