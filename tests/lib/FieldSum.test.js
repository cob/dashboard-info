/** @jest-environment node */
import fieldSum from "../../src/lib/FieldSum.js"

test('for "Arab world" population sum over years is 2.019.650.012', async () => {
    const results = await fieldSum({defId: 2, fieldName: "value", query: 'Arab  World indicator_name:"population, total"'})
    expect(results.value).toBe(2019650012)
    expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab  World indicator_name:\"population, total\"")
})