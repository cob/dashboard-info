/** @jest-environment node */
const { AbstractDefinitionInfo } = require("../src/AbstractDefinitionInfo")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('for learning app, "countries series" is definition 2 ', async () => {
    const mockUpdateCb = jest.fn()
    adi = new AbstractDefinitionInfo("b1","Countries Series", "*", 1, mockUpdateCb )

    
    await sleep(1000).then( () => {
        expect(adi.resultsUrl).toBe("/recordm/#/definitions/2/q=*")
        expect(adi.queryUrl).toBe("/recordm/recordm/definitions/search/name/Countries Series?from=0&size=0&q=*")
        adi.stopUpdates()
    })
})