/** @jest-environment node */
import fieldAverage from "../../src/lib/FieldAverage.js"

test('for "Arab world" population average over years is 403930002,4', async () => {
    const results = await fieldAverage({
        defId: 2,
        fieldName: "value",
        query: 'Arab  World indicator_name:"population, total"'
    })

    expect(results.value).toBe(403930002.4)
    expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab  World indicator_name:\"population, total\"")
})