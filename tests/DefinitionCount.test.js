/** @jest-environment node */
const { DefinitionCount } = require("../src/DefinitionCount")
const { auth, rmAddInstance, rmDeleteInstance } = require("@cob/rest-api-wrapper")

var Storage = require('dom-storage');
localStorage = new Storage('./db2.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('new DefinitionCount sets def and query ', () => {
    const mockUpdateCb = jest.fn()
    adi = new DefinitionCount("Countries Series",  mockUpdateCb, 1, "*", "c0" )
    adi.stopUpdates();
    expect(adi.def).toBe("Countries Series")
    expect(adi.query).toBe("*")
})


test('for learning app, "countries series" count for "Arab world" is 20', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("Countries Series", mockUpdateCb, 1, "Arab world", "c1" )
    
    return sleep(1000).then( () => {
        dc.stopUpdates()
        expect(dc.getValue()).toBe(20)
        done()
    })
})



test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("Countries Series", mockUpdateCb, 1, "Arab world", "c2" )
    
    return sleep(500).then( () => {
        expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
        expect(dc.getValue()).toBe(20)

        dc.setQuery("United")
        sleep(2500).then( () => {
            dc.stopUpdates()
            expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
            expect(dc.getValue()).toBe(60)
            done()
        })
    })
})


test('if we add another instance then there should be 1 more', (done) => {
    const mockUpdateCb = jest.fn() 
    
    return auth("jestTests", "1jestTests2")
    .then( () => {
        dc = new DefinitionCount("Test Person", mockUpdateCb, 1, "DefinitionCount Test", "c3" )

        sleep(200).then( () => {
            // Needs to be 0 (zero) to work
            // If not zero delete offending instances
            expect(dc.getValue()).toBe(0)
            rmAddInstance("Test Person", {"Name": "DefinitionCount Test"})
            .then( result => {
                sleep(1800).then( () => {
                    dc.stopUpdates()
                    rmDeleteInstance(result.id)
                    expect(dc.getValue()).toBe(1)
                    done()
                })
            })
            .catch( e => {
                done(e)
            })
        })
    })
    .catch( e => {
        done(e)
    })
})