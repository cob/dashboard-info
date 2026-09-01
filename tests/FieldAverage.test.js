/** @jest-environment node */
import fieldAverage from "../src/FieldAverage.js"

test('for "Arab world" population average over years is 403930002,4', (done) => {
    fieldAverage({defId:2, fieldName:"value", query:'Arab  World indicator_name:"population, total"' })
    .then( results => {
        expect(results.value).toBe(403930002.4)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab%20%20World%20indicator_name%3A%22population%2C%20total%22")
        done()
    })
    .catch( e => {
        done(e)
    })
})

test('for "arab" series marked with the year as "2018-07-10" the average total population 148775943.33333333. The query should not return results if made with a non-matching timezone.', async () => {

    const with_tz = await fieldAverage({defId:2, fieldName:"value", query:'year.date:2018-07-10 arab indicator_name:"Population, total"', tz:"Europe/Lisbon"})
    expect(with_tz.value).toBe(148775943.33333333)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date%3A2018-07-10%20arab%20indicator_name%3A%22Population%2C%20total%22")
    const wrong_tz = await fieldAverage({defId:2, fieldName:"value", query:'year.date:2018-07-10 arab indicator_name:"Population, total"', tz:"UTC"})
    expect(wrong_tz.value).toBe(0)
    expect(with_tz.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=year.date%3A2018-07-10%20arab%20indicator_name%3A%22Population%2C%20total%22")


})