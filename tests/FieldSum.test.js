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


test('for "arab" series marked with the year as "2018-07-10" the sum of total populations is 446327830. The query should not return results if made without timezone.', async (done) => {

    const with_tz = await fieldSum({defId:2, fieldName:"value", query:'year.date:2018-07-10 arab indicator_name:"Population, total"', tz:"Europe/Lisbon"})
    expect(with_tz.value).toBe(446327830)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date:2018-07-10%20arab%20indicator_name:%22Population,%20total%22")
    const without_tz = await fieldSum({defId:2, fieldName:"value", query:'year.date:2018-07-10 arab indicator_name:"Population, total"'})
    expect(without_tz.value).toBe(0)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date:2018-07-10%20arab%20indicator_name:%22Population,%20total%22")
    done()


})