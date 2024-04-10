/** @jest-environment node */
import fieldValues from "../src/FieldValues.js"

test('for "Arab world" there are 4 indicators', async () => {
    let results = await fieldValues({def:2, fieldName:"indicator_name.raw", query:'Arab  World'} )
     expect(results.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
})

test('for "Arab world" there are 4 indicators, but the query should fail if given the year 2018-07-10 without tz', async () => {
    let without_tz = await fieldValues({def:2, fieldName:"indicator_name.raw", query:'year.date:2018-07-10 Arab World'} )
     expect(without_tz.value).toEqual([])

    let with_tz = await fieldValues({def:2, fieldName:"indicator_name.raw", query:'year.date:2018-07-10 Arab World', tz:"Europe/Lisbon"} )
     expect(with_tz.value).toEqual([
        'Alternative and nuclear energy (% of total energy use)',
        'GDP: linked series (current LCU)',
        'Population, total',
        'Surface area (sq. km)'
        ])
    })