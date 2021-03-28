/** @jest-environment node */
import fieldValues from "../src/FieldValues.js"

test('for "Arab world" there are 4 indicators', async () => {
    let results = await fieldValues(2, "indicator_name.raw", 'Arab  World' )
    expect(results.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
})