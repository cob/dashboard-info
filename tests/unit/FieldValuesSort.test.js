/** @jest-environment node */
import { sortFunction } from "../../src/FieldValues.js"

// Instance fields come from ES as arrays, e.g. {value: ["10"]}
const inst = (v) => (v === undefined ? {} : {f: [v]})

test('numeric strings compare numerically ("9" < "10")', () => {
    expect(sortFunction("f", "asc", inst("9"), inst("10"))).toBeLessThan(0)
    expect(sortFunction("f", "asc", inst("10"), inst("9"))).toBeGreaterThan(0)
    expect(sortFunction("f", "desc", inst("9"), inst("10"))).toBeGreaterThan(0)
})

test('mixed numeric and non-numeric values never produce NaN and stay consistent', () => {
    // Regression: isNumB was computed with isNumeric(xA), so a numeric xA next
    // to a non-numeric xB compared as numbers and returned NaN.
    const ab = sortFunction("f", "asc", inst("10"), inst("abc"))
    const ba = sortFunction("f", "asc", inst("abc"), inst("10"))

    expect(Number.isNaN(ab)).toBe(false)
    expect(Number.isNaN(ba)).toBe(false)
    // Comparator consistency: swapping the arguments inverts the sign
    expect(ab).toBeLessThan(0)      // "10" < "abc" as strings
    expect(ba).toBeGreaterThan(0)
})

test('plain strings compare lexicographically', () => {
    expect(sortFunction("f", "asc", inst("alpha"), inst("beta"))).toBeLessThan(0)
    expect(sortFunction("f", "asc", inst("beta"), inst("alpha"))).toBeGreaterThan(0)
    expect(sortFunction("f", "asc", inst("alpha"), inst("alpha"))).toBe(0)
})

test('missing values go last in ascending order', () => {
    expect(sortFunction("f", "asc", inst(undefined), inst("x"))).toBeGreaterThan(0)
    expect(sortFunction("f", "asc", inst("x"), inst(undefined))).toBeLessThan(0)
    expect(sortFunction("f", "asc", inst(undefined), inst(undefined))).toBe(0)
})

test('sorting a mixed array is stable and deterministic', () => {
    const values = ["abc", "10", "2", "zz", "1"].map(inst)
    const sorted = values.sort((a, b) => sortFunction("f", "asc", a, b)).map(i => i.f[0])
    expect(sorted).toEqual(["1", "2", "10", "abc", "zz"])
})
