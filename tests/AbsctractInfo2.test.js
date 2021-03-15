/** @jest-environment node */
const { AbstractInfo } = require("../src/AbstractInfo")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('witho pre-cache value start with cache value', async () => {
    await sleep(2000).then( () => {  })
    //Wait for previous testes to clear

    const mockUpdateCb = jest.fn()
    ai1 = new AbstractInfo("x","1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai1);
    bound();
    
    await sleep(1000).then( () => {
        expect(ai1.getValue()).toBe(2)
        expect(mockUpdateCb.mock.calls.length).toBe(3)
    })

    ai2 = new AbstractInfo("x","1", mockUpdateCb )
    // Initially _getValue should return what is on db.json (2)
    expect(ai2.getValue()).toBe(2)
    jest.clearAllTimers()
})