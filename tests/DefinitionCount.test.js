/** @jest-environment node */
const { DefinitionCount } = require("../src/DefinitionCount")
const { auth, rmAddInstance, rmDeleteInstance } = require("@cob/rest-api-wrapper")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('for learning app, "countries series" count for "Arab world" is 20', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("c1","Countries Series", "Arab world", 1, mockUpdateCb )
    dc.forceRefresh()
    
    return sleep(1000).then( () => {
        expect(dc.getValue()).toBe(20)
        dc.stopUpdates()
        done()
    })
    .catch( e => {
        done(e)
    })
})



test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new DefinitionCount("c2","Countries Series", "Arab world", 1, mockUpdateCb )
    
    return sleep(500).then( () => {
        expect(dc.getValue()).toBe(20)
        expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")

        dc.setQuery("United")
        sleep(1000).then( () => {
            expect(dc.getValue()).toBe(60)
            expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
            dc.stopUpdates()
            done()
        })
        .catch( e => {
            dc.stopUpdates()
            done(e)
        })
    })
    .catch( e => {
        dc.stopUpdates()
        done(e)
    })
})


test('if we add another instance, should be 1 more', (done) => {
    const mockUpdateCb = jest.fn() 
    localStorage.removeItem("anonymous-c3_Value")
    
    return auth("jestTests", "1jestTests2")
    .then( () => {
        dc = new DefinitionCount("c3","Test Person", "DefinitionCount Test", 1, mockUpdateCb )

        sleep(200).then( () => {
            expect(dc.getValue()).toBe(0)
            rmAddInstance("Test Person", {"Name": "DefinitionCount Test"})
            .then( result => {
                dc.forceRefresh()
                sleep(1100).then( () => {
                    expect(dc.getValue()).toBe(1)
                    rmDeleteInstance(result.id)
                    sleep(500).then( () => {
                        dc.stopUpdates()
                        done()
                    })
                    .catch( e => {
                        done(e)
                    })
                })
                .catch( e => {
                    done(e)
                })
            })
            .catch( e => {
                done(e)
            })
        })
        .catch( e => {
            done(e)
        })
    })
    .catch( e => {
        done(e)
    })
})
