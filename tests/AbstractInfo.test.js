/** @jest-environment node */
const { AbstractInfo } = require("../src/AbstractInfo")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

var Storage = require('dom-storage');
localStorage = new Storage('./db1.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 


test('getValue() starts by returning cached value', async () => {
    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-a1_Value",42)
    
    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("a1", "*", .2, mockUpdateCb )
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


test('getValue() should increase 1 per "validity" time', async (done) => {
    const mockUpdateCb = jest.fn()
    ai = new AbstractInfo("a2", "*", 1, mockUpdateCb )
    const bound = mockUpdateCb.bind(ai);
    bound();

    // Without cache initial getValue() should be 'undefined'
    expect(ai.getValue()).toBe(undefined)
    expect(mockUpdateCb.mock.calls.length).toBe(1);

    // after the initial setup all calls until validity (1s)
    // should return the first value (1) and the callback 
    // should not be called because validity isn't reached
    return sleep(100).then( () => {
        expect(mockUpdateCb.mock.calls.length).toBe(2)
        expect(ai.getValue()).toBe(1)

        //Total time: 300ms => no change expected
        sleep(200).then( () => {
            expect(ai.getValue()).toBe(1)
            expect(mockUpdateCb.mock.calls.length).toBe(2)
            //Total time: 600ms => no change expected
            sleep(300).then( () => {
                expect(ai.getValue()).toBe(1)
                expect(mockUpdateCb.mock.calls.length).toBe(2)
                //Total time: 1400ms => now the value should change and we have another call to CB
                sleep(800).then( () => {
                    ai.stopUpdates()
                    expect(ai.getValue()).toBe(2)
                    expect(mockUpdateCb.mock.calls.length).toBe(3)
                    done()
                })
            })
        })
    })
})


test('2 objects for the same info should only call 1 _getNewValue() every "validity" period ', (done) => {
    const mockUpdateCb = jest.fn()
    ai1 = new AbstractInfo("a3", "*", "1", mockUpdateCb )
    const bound = mockUpdateCb.bind(ai1);
    bound();
    
    expect(ai1.getValue()).toBe(undefined)
    
    return sleep(100).then( () => {
        // _getNewValue() should have been called 1 time
        expect(ai1.getValue()).toBe(1) 
        
        sleep(500).then( () => {
            ai2 = new AbstractInfo("a3", "*", "1", mockUpdateCb )
            // _getNewValue() should not need to be called (cache is still valid)
            expect(ai2.getValue()).toBe(1) 

            sleep(800).then( () => {
                // _getNewValue() should have another call (after 1.4s we need another value)
                ai1.stopUpdates()
                expect(ai1.getValue()).toBe(2)
                
                sleep(600).then( () => {
                    // _getNewValue() should not have needed to be called (cache is still valid) 
                    ai2.stopUpdates()
                    expect(ai2.getValue()).toBe(2)
                    done()
                })    
            })    
        })
        .catch( e => {
            done(e)
        })    
    })
})

test('updating the query should force a _getNewValue call', () => {
    const mockUpdateCb = jest.fn()
    adi = new AbstractInfo("a4", "query1", 1, mockUpdateCb )
    adi.stopUpdates()
    expect(adi.query).toBe("query1")
    adi.setQuery("query2")
    expect(adi.query).toBe("query2")
})