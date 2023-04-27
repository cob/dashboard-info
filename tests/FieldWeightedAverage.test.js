/** @jest-environment node */
import fieldWeightedAverage from "../src/FieldWeightedAverage.js"

test('for "Arab world" population Weighted average over years is 399413697,382, weighted by the instanceId :)', (done) => {
    fieldWeightedAverage({defId:2, fieldName:"value", weightFieldName:"instanceId", query:'Arab  World indicator_name:"population, total"' })
    .then( results => {
        expect(results.value).toBe(399413697.3819946)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20%20World%20indicator_name:%22population,%20total%22")
        done()
    })
    .catch( e => {
        done(e)
    })
})