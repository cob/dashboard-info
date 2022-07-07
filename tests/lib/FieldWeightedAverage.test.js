/** @jest-environment node */
import fieldWeightedAverage from "../../src/lib/FieldWeightedAverage.js"

test('for "Arab world" population Weighted average over years is 399413697,382, weighted by the instanceId :)', async () => {
    const results = await fieldWeightedAverage({
        defId: 2,
        fieldName: "value",
        weightFieldName: "instanceId",
        query: 'Arab  World indicator_name:"population, total"'
    })
    expect(results.value).toBe(399413697.3819946)
    expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab  World indicator_name:\"population, total\"")
})