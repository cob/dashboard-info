/** @jest-environment node */
import fieldAverage from "../src/FieldAverage.js"

test('for "Arab world" population average over years is 403930002,4', (done) => {
    fieldAverage({defId:2, fieldName:"value", query:'Arab  World indicator_name:"population, total"' })
    .then( results => {
        expect(results.value).toBe(403930002.4)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20%20World%20indicator_name:%22population,%20total%22")
        done()
    })
    .catch( e => {
        done(e)
    })
})