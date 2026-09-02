/** @jest-environment node */
import DashInfo from "../src/DashInfo.js"
import {definitionCount} from "../src/index.js"
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

test('every DashInfo value starts by having the last cached value',  async () => {

    //Setup cache with "42", the answer for everything
    localStorage.setItem("cob-dash-info | anonymous | test1", JSON.stringify( { "Results": JSON.stringify({value:42}) } ));

    let zeroTest = new DashInfo( {validity:0, noDelays:true}, newCountCalls(0,"test1") )
    expect(zeroTest.value).toBe(42)
    await nop()
    expect(zeroTest.value).toBe(1)
})

test('DashInfo should only have a new value every *validity* seconds, in this case 1s ',  async () => {
    let countInfo = new DashInfo( {validity:0.1, noDelays:true}, newCountCalls(0, "test2"))
    const start = Date.now()
    try {
        expect(countInfo.value).toBeUndefined()
        
        await delay(5)
        expect(countInfo.value).toBe(1) // Shouldn't change
        
        await delay(20)
        expect(countInfo.value).toBe(1) // Still shouldn't change
        await nop() 
        expect(countInfo.value).toBe(1) // Shouldn't change
        await nop() 
        expect(countInfo.value).toBe(1) // Shouldn't change
        await nop() 
        expect(countInfo.value).toBe(1) // Shouldn't change

        // Land mid-way into the second validity window: the refresh happens at
        // ~100ms and the following one at ~200ms, so assert at ~150ms measured
        // from the start — immune to the accumulated overhead of the awaits above
        // (a fixed delay(170) put this assert right at the ~200ms boundary,
        // observing 2 or 3 depending on the machine's timer precision)
        await delay(150 - (Date.now() - start))
        expect(countInfo.value).toBe(2) // CHANGE TIME !
        // await nop() 
        // expect(countInfo.value).toBe(2) // Shouldn't change
        // await nop() 
        // expect(countInfo.value).toBe(2) // Shouldn't change
        // await nop() 
        // expect(countInfo.value).toBe(2) // Shouldn't change
        // await nop() 
        // expect(countInfo.value).toBe(2) // Shouldn't change

        // await delay(100)
        // expect(countInfo.value).toBe(2) // Shouldn't change

        // // Test extra cycle
        // await delay(1000)
        // expect(countInfo.value).toBe(3) // CHANGE TIME !
        // await nop()
        // expect(countInfo.value).toBe(3) // Shouldn't change
        // await nop()
        // expect(countInfo.value).toBe(3) // Shouldn't change
        // await nop()
        // expect(countInfo.value).toBe(3) // Shouldn't change
    }
    finally {
        countInfo.stopUpdates()
    }
})    

test('2 consecutive calls to same query should only have 1 call to BE, made on the first Dashinfo ',  async () => {
    let countCalls = newCountCalls(0, "test3")
    let countCalls2 = newCountCalls(100, "test3")

    let countInfo = new DashInfo( {validity:1}, countCalls)
    let countInfo2 = new DashInfo( {validity:1}, countCalls2)
    
    try {
        expect(countInfo.value).toBeUndefined()
        expect(countInfo2.value).toBeUndefined()
        
        await delay(500)
        expect(countInfo.value).toBe(1)
        expect(countInfo2.value).toBe(101)
    }
    finally {
        countInfo.stopUpdates()
        countInfo2.stopUpdates()
    }
})    

test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', async () => {
    // TODO
        const mockUpdateCb = jest.fn()
        let dc = definitionCount( "Countries Series", "Arab world", {changeCB: mockUpdateCb})

        await  delay(1000)
        expect(dc.results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20world")
        expect(dc.value).toBe(20)

        dc.changeArgs({query:"United"})
        dc.stopUpdates()
        await delay(1000)
        expect(dc.results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
        expect(dc.value).toBe(60)

    })
    
// // test('if no cache available (no mem or no localstorage) it work without cache', () => {
// //     //TODO
// // })

// // test('old values are cleanned by _cleancache', () => {
// //     //TODO
// // })

// // // TODO: test changing query stops previous setTimeout