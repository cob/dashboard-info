/** @jest-environment node */
import DashInfo from "../src/DashInfo.js"
import newCountCalls from "./CountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'
import {jest} from '@jest/globals';


localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
beforeAll( () => localStorage.clear() )

function delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    });
 }

 function nop() {
    return new Promise(function(resolve) { 
        setImmediate( resolve )
    });
 }

test('every DashInfo value starts by having the last cached value',  async (done) => {

    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-test1", JSON.stringify( { "Results": JSON.stringify({value:42}) } ));

    let zeroTest = new DashInfo( {validity:0}, newCountCalls(0,"test1") )
    expect(zeroTest.value).toBe(42)
    await nop()<
    expect(zeroTest.value).toBe(1)
    done()
})

test('DashInfo should only have a new value every *validity* seconds, in this case 1s ',  async (done) => {
    let countInfo = new DashInfo( {validity:1}, newCountCalls(0, "test2"))
    try {
        expect(countInfo.value).toBeUndefined()
               
        await delay(100)
        expect(countInfo.value).toBe(1) // Shouldn't change
        
        await delay(200)
        expect(countInfo.value).toBe(1) // Still shouldn't change
        
        await delay(1300)
        expect(countInfo.value).toBe(2) // CHANGE TIME !
        
        await delay(100)
        expect(countInfo.value).toBe(2) // Shouldn't change
        
        done()
    }
    finally {
        countInfo.stopUpdates()
    }
})    

test('2 consecutive calls to same query should only have 1 call to BE, made on the first Dashinfo ',  async (done) => {
    let countCalls = newCountCalls(0, "test3")
    let countCalls2 = newCountCalls(100, "test3")

    let countInfo = new DashInfo( {validity:1}, countCalls)
    let countInfo2 = new DashInfo( {validity:1}, countCalls2)
    
    try {
        expect(countInfo.value).toBeUndefined()
        expect(countInfo2.value).toBeUndefined()
        
        await delay(500)
        expect(countInfo.value).toBe(1)
        expect(countInfo2.value).toBe(1)
        done()
    }
    finally {
        countInfo.stopUpdates()
        countInfo2.stopUpdates()
    }
})    

// test('TWO objects for the same info should only call ONE _getNewValue() every *validity* seconds ', () => {
//     //TODO
// })

// test('expired cache is cleaned every new DashInfo', () => {
//     //TODO
// })

// test('if no cache available (no mem or no localstorage) it work without cache', () => {
//     //TODO
// })

// test('old values are cleanned by _cleancache', () => {
//     //TODO
// })

// test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', () => {
// // TODO
// //     const mockUpdateCb = jest.fn()
// //     dc = new DefinitionCount("Countries Series", mockUpdateCb, 1, "Arab world", "c2" )
    
// //     return sleep(500).then( () => {
// //         expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
// //         expect(dc.getValue()).toBe(20)

// //         dc.setQuery("United")
// //         sleep(2500).then( () => {
// //             dc.stopUpdates()
// //             expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
// //             expect(dc.getValue()).toBe(60)
// //             done()
// //         })
// //     })
// })

// // TODO: test changing query stops previous setTimeout