/** @jest-environment node */
import fieldValues from "../src/FieldValues.js"

test('for "Arab world" there are 4 indicators', async () => {
    let results = await fieldValues({def:2, fieldName:"indicator_name", query:'Arab  World'} )
    expect(results.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
})

test('for "Arab world" there are 4 indicators (by definition name)', async () => {
    let results = await fieldValues({def:"Countries Series", fieldName:"indicator_name", query:'Arab  World'} )
    expect(results.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
})