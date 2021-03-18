/** @jest-environment node */
const { FieldDistinctValues } = require("../src/FieldDistinctValues")

var Storage = require('dom-storage');
localStorage = new Storage('./db6.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

test('new FieldDistinctValues sets defId, size, and fieldName  ', () => {
    const mockUpdateCb = jest.fn()
    adi = new FieldDistinctValues(2, "value", mockUpdateCb, 1, 'Arab  World',  10, "f0" )
    adi.stopUpdates();
    expect(adi.defId).toBe(2)
    expect(adi.size).toBe(10)
    expect(adi.fieldName).toBe("value")
})

test('for "Arab world" there are 4 indicators', (done) => {
    const mockUpdateCb = jest.fn()
    //NOTE: you allways have to use a raw for ES
    dc = new FieldDistinctValues(2, "indicator_name.raw", mockUpdateCb, 1, 'Arab  World', 10,  "f1" )
    
    return sleep(1000).then( () => {
        dc.stopUpdates()
        expect(dc.getValue()).toEqual([
            'Alternative and nuclear energy (% of total energy use)',
            'GDP: linked series (current LCU)',
            'Population, total',
            'Surface area (sq. km)'
          ])
        done()
    })
})