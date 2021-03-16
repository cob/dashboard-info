/** @jest-environment node */
const { AbstractInfo } = require("../src/AbstractInfo")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

var Storage = require('dom-storage');
localStorage = new Storage('./db.json', { strict: false, ws: '  ' });


test('getValue() starts by returning cached value', async () => {
    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-a1_Value",42)
    
    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("a1",0.2, mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();
    
    // Innitially getValue should be "42", the answer for everything
    expect(ai.getValue()).toBe(42)

    await sleep(1).then( () => {
        // After 1s ai1 should return 2 for getValue()
        expect(ai.getValue()).toBe(1)
        ai.stopUpdates()
    })

})


test('getValue() should increase 1 per "validity" time', async () => {
    //Clear a cache
    localStorage.removeItem("anonymous-a2_Value")

    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("a2","1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();

    // Without cache initial getValue() should be 'undefined'
    expect(ai.getValue()).toBe(undefined)
    expect(mockUpdateCb.mock.calls.length).toBe(1);

    // after the initial setup all calls until validity (1s)
    // should return the first value (1) and the callback 
    // should not be called because validity isn't reached
    await sleep(100).then( () => {
        expect(mockUpdateCb.mock.calls.length).toBe(2)
        expect(ai.getValue()).toBe(1)
    })
    //Total time: 300ms => no change expected
    await sleep(200).then( () => {
        expect(ai.getValue()).toBe(1)
        expect(mockUpdateCb.mock.calls.length).toBe(2)
    })
    //Total time: 900ms => no change expected
    await sleep(600).then( () => {
        expect(ai.getValue()).toBe(1)
        expect(mockUpdateCb.mock.calls.length).toBe(2)
    })
    //Total time: 1200ms => now the value should change and we have another call to CB
    await sleep(300).then( () => {
        expect(ai.getValue()).toBe(2)
        expect(mockUpdateCb.mock.calls.length).toBe(3)
        ai.stopUpdates()
    })
})


test('2 objects for the same info should only call 1 _getNewValue() every "validity" period ', async () => {
    //Clear a cache
    localStorage.removeItem("anonymous-a3_Value")

    const mockUpdateCb = jest.fn()
    ai1 = new AbstractInfo("a3","1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();

    expect(ai1.getValue()).toBe(undefined)

    await sleep(100).then( () => {
        // _getNewValue() should have been called 1 time
        expect(ai1.getValue()).toBe(1) 
    })

    await sleep(500).then( () => {
        ai2 = new AbstractInfo("a3","1", mockUpdateCb )
        // _getNewValue() should not need to be called (cache is still valid)
        expect(ai2.getValue()).toBe(1) 
    })
    
    await sleep(500).then( () => {
        // _getNewValue() should have another call (after 1.1s we need another value)
        expect(ai1.getValue()).toBe(2)
        ai1.stopUpdates()
    })    
    
    await sleep(500).then( () => {
        // _getNewValue() should not need to be called (cache is still valid)
        expect(ai2.getValue()).toBe(2)
        ai2.stopUpdates()
    })    
})


test('stopping updates should stop calling _getNewValue() ', async () => {
    //Clear a cache
    localStorage.removeItem("anonymous-a4_Value")

    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("a4","1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();

    expect(ai.getValue()).toBe(undefined)

    await sleep(10).then( () => {
        // _getNewValue() should have been called 1 time
        expect(ai.getValue()).toBe(1) 
        ai.stopUpdates()
    })
    
    await sleep(2000).then( () => {
        // _getNewValue() should still have been called the same 1 time
        expect(ai.getValue()).toBe(1) 
    })    
})


//TODO: after a refresh expect _getNewValue allways to be called (in particular if validity hadn't expired)