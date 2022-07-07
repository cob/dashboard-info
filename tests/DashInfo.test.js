/** @jest-environment node */
import DashInfo from "src/DashInfo.js"
import repeat from "tests/utils/Repeat.js";
import newCountCalls from "tests/utils/NewCountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'
import sleep from "../src/utils/Sleep.js";

// eslint-disable-next-line no-global-assign
localStorage = new Storage('./db.json', {strict: false, ws: '  '});

beforeEach(() => localStorage.clear())

test('every DashInfo value starts by having the last cached value', async () => {

    //Setup cache with "42", the answer for everything :)
    localStorage.setItem("anonymous-_Results", JSON.stringify({value: 42}));

    let previousState
    let loadedInitialValues = false

    const dashInfo = new DashInfo(
        {
            validity: 5,
            onStateChange: function(newState) {
                if (!loadedInitialValues) {
                    loadedInitialValues = (previousState === 'loading' && newState === 'cache' && this.value === 42)
                }
                previousState = newState
            }
        },
        () => {},
        null)

    await sleep(1000)
    dashInfo.stopUpdates()

    expect(loadedInitialValues).toStrictEqual(true)
})

test('DashInfo should only have a new value every *validity* seconds', async () => {
    const countInfo = new DashInfo(
        {validity: 1},
        newCountCalls(),
        {offset: 0})

    let previousValue = null
    let collectedValues = []

    // Collect all valus changes during this period
    await repeat(30, 100, () => {
        if (previousValue !== countInfo.value) {
            collectedValues.push({timestamp: Date.now(), value: countInfo.value})
            previousValue = countInfo.value
        }
    })

    countInfo.stopUpdates()

    expect(collectedValues.length).toBeGreaterThanOrEqual(3)

    collectedValues = collectedValues.slice(0, 3)

    let keysReduceObj = collectedValues.reduce((pv, cv) => {
        pv[cv.timestamp] = cv.value;
        return pv
    }, {});
    expect(Object.keys(keysReduceObj)).toHaveLength(3)

    expect([...new Set(collectedValues.map(v => v.value))]).toHaveLength(3)
    expect([...new Set(collectedValues.map(v => v.value))]).toStrictEqual([undefined, 1, 2])
})

test('TWO objects for the same info should only call ONE _getNewValue() every *validity* seconds', () => {
    //TODO
})

test('if no cache available (no mem or no localstorage) it work without cache', () => {
    //TODO
})

test('if no cache available (no mem or no localstorage) tries to clear up some memory', () => {
    //TODO
})

test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', () => {
// TODO
//     const mockUpdateCb = jest.fn()
//     dc = new DefinitionCount("Countries Series", mockUpdateCb, 1, "Arab world", "c2" )

//     return sleep(500).then( () => {
//         expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=Arab world")
//         expect(dc.getValue()).toBe(20)

//         dc.setQuery("United")
//         sleep(2500).then( () => {
//             dc.stopUpdates()
//             expect(dc.resultsUrl).toBe("https://learning.cultofbits.com/recordm/#/definitions/2/q=United")
//             expect(dc.getValue()).toBe(60)
//             done()
//         })
//     })
})

// TODO: test changing query stops previous setTimeout