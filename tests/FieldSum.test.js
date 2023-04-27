/** @jest-environment node */
import fieldSum from "../src/FieldSum.js"

test('for "Arab world" population sum over years is 2.019.650.012', (done) => {
    fieldSum({defId:2, fieldName:"value", query:'Arab  World indicator_name:"population, total"' })
    .then( results => {
        expect(results.value).toBe(2019650012)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20%20World%20indicator_name:%22population,%20total%22")
        done()
    })
    .catch( e => {
        done(e)
    })
})