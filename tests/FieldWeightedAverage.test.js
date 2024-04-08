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

test('for "arab" population series marked with the year as "2018-07-10" the weighted average over years is 240194450.99374565, weighted by the instanceId :). The query should not return results if made without timezone.', async (done) => {
    const with_tz = await fieldWeightedAverage({defId:2, fieldName:"value", weightFieldName:"instanceId", query:'year.date:2018-07-10 arab indicator_name:"Population, total"', tz:"Europe/Lisbon"})
    expect(with_tz.value).toBe(240194450.99374565)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date:2018-07-10%20arab%20indicator_name:%22Population,%20total%22")
    const without_tz = await fieldWeightedAverage({defId:2, fieldName:"value", weightFieldName:"instanceId", query:'year.date:2018-07-10 arab indicator_name:"Population, total"'})
    expect(without_tz.value).toBe(0)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date:2018-07-10%20arab%20indicator_name:%22Population,%20total%22")
    done()


})