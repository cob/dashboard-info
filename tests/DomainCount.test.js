/** @jest-environment node */
const { DomainCount } = require("../src/DomainCount")

var Storage = require('dom-storage');
localStorage = new Storage('./db4.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('new Domain sets def and query ', () => {
    const mockUpdateCb = jest.fn()
    adi = new DomainCount(2, mockUpdateCb, 1, "*", "e1" )
    adi.stopUpdates();
    expect(adi.domainId).toBe(2)
    expect(adi.query).toBe("*")
})


test('for learning app, demo domain count for "Arab world" is 22', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new DomainCount(2, mockUpdateCb, 1, "Arab world", "e2" )
    dc.forceRefresh()
    
    return sleep(1000).then( () => {
        dc.stopUpdates()
        expect(dc.getValue()).toBe(22)
        done()
    })
})