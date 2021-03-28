/** @jest-environment node */
import DashInfo from "../src/DashInfo.js"
import newCountCalls from "./CountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'
import {jest} from '@jest/globals';


localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
beforeAll( () => localStorage.clear() )


test('every DashInfo value starts by having the last cached value', async () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(0)   

    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-_Results",JSON.stringify({value:42}));

    let countInfo = new DashInfo( {validity:1}, () => new Promise( (resolve, reject) => reject("Fail on purpose!") ))
    await Promise.resolve() //Allow other promises to resolve

    await countInfo.startUpdates().catch ( () => {})
    
    expect(countInfo.value).toBe(42)
})

test('DashInfo should only have a new value every *validity* seconds ',  async () => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(0)   
    
    let a = new DashInfo( {validity:1}, newCountCalls(), 0)
    await Promise.resolve() //Allow other promises to resolve (loggedinuser)
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
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(2) // CHANGE TIME !
    
    jest.setSystemTime(1601)
    jest.advanceTimersByTime(500)
    await Promise.resolve() //Allow other promises to resolve
    expect(a.value).toBe(2) // Shouldn't change
})    

test('TWO objects for the same info should only call ONE _getNewValue() every *validity* seconds ', () => {
    //TODO
})

test('expired cache is cleaned every new DashInfo', () => {
    //TODO
})

test('if no cache available (no mem or no localstorage) it work without cache', () => {
    //TODO
})

test('old values are cleanned by _cleancache', () => {
    //TODO
})

test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', () => {
// TODO
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
})

// TODO: test changing query stops previous setTimeout