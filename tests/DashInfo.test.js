/** @jest-environment node */
import DashInfo from "../src/DashInfo.js"
import newCountCalls from "./CountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'
import { umLoggedin } from "@cob/rest-api-wrapper"

import {jest} from '@jest/globals';


localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
beforeAll( () => localStorage.clear() )

function delay(t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    });
 }


test('every DashInfo value starts by having the last cached value',  async (done) => {

    //Setup cache with "42", the answer for everything
    localStorage.setItem("anonymous-_Results",JSON.stringify({value:42}));

    let zeroTest = new DashInfo( {validity:1}, () => delay(2000))
    delay(1000).then (() => {
        zeroTest.stopUpdates()
        expect(zeroTest.value).toBe(42)
        done()
    })
})

test('DashInfo should only have a new value every *validity* seconds ',  async (done) => {
    let countInfo = new DashInfo( {validity:1}, newCountCalls(), 0)
    
    try {
        expect(countInfo.value).toBeUndefined()
        
        await delay(500)
        expect(countInfo.value).toBe(1)
        
        await delay(200)
        expect(countInfo.value).toBe(1) // Shouldn't change
        
        await delay(200)
        expect(countInfo.value).toBe(1) // Still shouldn't change
        
        await delay(500)
        expect(countInfo.value).toBe(2) // CHANGE TIME !
        
        await delay(500)
        expect(countInfo.value).toBe(2) // Shouldn't change
        done()
    }
    finally {
        countInfo.stopUpdates()
    }
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