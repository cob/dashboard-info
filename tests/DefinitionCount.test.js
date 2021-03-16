/** @jest-environment node */
const { DefinitionCount } = require("../src/DefinitionCount")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('for learning app, "countries series" count for "Arab world" is 20', async () => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("c1","Countries Series", "Arab world", 1, mockUpdateCb )
    dc.forceRefresh()
    
    await sleep(1000).then( () => {
        expect(dc.getValue()).toBe(20)
        dc.stopUpdates()
    })
})

test('if we add another series, "countries series" count for "Arab world" is 21, but only after 1 second', async () => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("c2","Countries Series", "Arab world", 1, mockUpdateCb )
    
    
    await sleep(1000).then( () => {
        //TODO: add record
        expect(dc.getValue()).toBe(20)
    })
    
    // await sleep(1000).then( () => {
    //     expect(dc.getValue()).toBe(21)
    //     //TODO: delete record
    // })
    
    await sleep(1000).then( () => {
        expect(dc.getValue()).toBe(20)
        dc.stopUpdates()
    })
})
