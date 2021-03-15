const { AbstractInfo } = require("../src/AbstractInfo")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('without pre-cache value should change once per validity time', async () => {
    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("x","1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();

    // Initially _getValue should be undefined
    expect(ai.getValue()).toBe(undefined)
    expect(mockUpdateCb.mock.calls.length).toBe(1);

    // after the initial setup all calls until validity (1s)
    // should return the first value (1) and the callback 
    // should not be called because value hasn't changed
    await sleep(100).then( () => {
        expect(mockUpdateCb.mock.calls.length).toBe(2)
        expect(ai.getValue()).toBe(1)
    })
    await sleep(200).then( () => {
        expect(ai.getValue()).toBe(1)
        expect(mockUpdateCb.mock.calls.length).toBe(2)
    })
    await sleep(300).then( () => {
        expect(ai.getValue()).toBe(1)
        expect(mockUpdateCb.mock.calls.length).toBe(2)
    })
    // Now the value should change and we have a second call to CB
    await sleep(1050).then( () => {
        expect(ai.getValue()).toBe(2)
        expect(mockUpdateCb.mock.calls.length).toBe(3)
    })
})