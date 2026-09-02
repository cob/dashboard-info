/** @jest-environment node */
import { definitionCount, domainCount, equipmentCount } from "../../src/Counts.js"
import { fieldSum, fieldAverage, fieldWeightedAverage } from "../../src/FieldAggregations.js"
import instancesList from "../../src/InstancesList.js"
import fieldValues from "../../src/FieldValues.js"
import { httpGet, httpPost } from "../../src/HttpRequest.js"

// These ids are part of the cache-key contract (localStorage keys shared
// between tabs/sessions). Changing one silently invalidates existing caches
// and, worse, a duplicated one would make two getters share cache entries.
test('every getter declares a stable, unique, explicit id', () => {
    const ids = [definitionCount, domainCount, equipmentCount, fieldSum,
        fieldAverage, fieldWeightedAverage, instancesList, fieldValues,
        httpGet, httpPost].map( getter => getter.id )

    expect(ids).toEqual(["definitionCount", "domainCount", "equipmentCount",
        "fieldSum", "fieldAverage", "fieldWeightedAverage", "instancesList",
        "fieldValues", "httpGet", "httpPost"])
    expect(new Set(ids).size).toBe(ids.length)
})
