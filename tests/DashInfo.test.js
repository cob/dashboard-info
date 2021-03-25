/** @jest-environment node */

import DashInfo from "../src/DashInfo.js"
import newCountCalls from "./CountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'
import {jest} from '@jest/globals';


localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
beforeAll( () => localStorage.clear() )


test('every DashInfo value starts by beeing the last cached value', async () => {
    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-countCalls_Results",JSON.stringify({"value":42}));

    
    let ai = new DashInfo( {validity:1}, newCountCalls())
    expect(ai.value).toBe(42)

    await Promise.resolve() //Allow other promises to resolve
    expect(ai.value).toBe(1)
    ai.stopUpdates()
})

test('DashInfo should only have a new value every 1s (validity used in test) ',  async () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(0)   
    
    let a = new DashInfo( {validity:1}, newCountCalls(), "newIdHack")
    expect(a.value).toBeUndefined()
    
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(1)
    
    jest.setSystemTime(101)
    jest.advanceTimersByTime(100)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(1) // Shouldn't change
    
    jest.setSystemTime(801)
    jest.advanceTimersByTime(700)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(1) // Still shouldn't change
    
    
    jest.setSystemTime(1101)
    jest.advanceTimersByTime(300)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(2) // CHANGE TIME !
    
    jest.setSystemTime(1601)
    jest.advanceTimersByTime(500)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(2) // Shouldn't change
    
    jest.setSystemTime(2101)
    jest.advanceTimersByTime(400)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(3) // CHANGE TIME !
    
    jest.setSystemTime(2601)
    jest.advanceTimersByTime(500)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(3) // Shouldn't change
    
    jest.setSystemTime(3101)
    jest.advanceTimersByTime(500)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(4) // CHANGE TIME !
})    

test('2 objects for the same info should only call 1 _getNewValue() every "validity" period ', () => {
    //TODO
})

test('expired cache is cleaned every new DashInfo', () => {
    //TODO
})

test('if no cache available (no mem or no localstorage) it work without cache', () => {
    //TODO
})

// TODO: test changing query
// test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', (done) => {
//     const mockUpdateCb = jest.fn()
//     dc = new DefinitionCount("Countries Series", mockUpdateCb, 1, "Arab world", "c2" )
    
//     return sleep(500).then( () => {
//         expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
//         expect(dc.getValue()).toBe(20)

//         dc.setQuery("United")
//         sleep(2500).then( () => {
//             dc.stopUpdates()
//             expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
//             expect(dc.getValue()).toBe(60)
//             done()
//         })
//     })
// })

// TODO: test changing query stops previous setTimeout