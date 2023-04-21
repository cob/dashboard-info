/** @jest-environment node */
import fieldValuesHits from "../src/FieldValuesHits.js"

test('for "Arab world" there are 4 indicators', async () => {
    let results = await fieldValuesHits({defId:2, fieldName:"indicator_name", query:'Arab  World'} )
    expect(results.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
})