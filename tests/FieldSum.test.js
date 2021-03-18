/** @jest-environment node */
const { FieldSum } = require("../src/FieldSum")

var Storage = require('dom-storage');
localStorage = new Storage('./db5.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('new FieldSum sets defId value  ', () => {
    const mockUpdateCb = jest.fn()
    adi = new FieldSum(2, "value", mockUpdateCb, 1, 'Arab  World', "e0" )
    adi.stopUpdates();
    expect(adi.defId).toBe(2)
    expect(adi.fieldName).toBe("value")
})

test('for "Arab world" population sum over years is 2.019.650.012', (done) => {
    const mockUpdateCb = jest.fn()
    dc = new FieldSum(2, "value", mockUpdateCb, 1, 'Arab  World indicator_name:"population, total"', "e1" )
    
    return sleep(1000).then( () => {
        dc.stopUpdates()
        expect(dc.getValue()).toBe(2019650012)
        done()
    })
})