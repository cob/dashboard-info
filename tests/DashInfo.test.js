/** @jest-environment node */
import DashInfo from "src/DashInfo.js"
import sleep from "src/utils/Sleep.js";
import retry from "tests/utils/Retry.js";
import newCountCalls from "tests/utils/NewCountCalls.js";
import Storage from '../node_modules/dom-storage/lib/index.js'

// eslint-disable-next-line no-global-assign
localStorage = new Storage('./db.json', {strict: false, ws: '  '});

beforeEach(() => localStorage.clear())

test('every DashInfo value starts by having the last cached value', (done) => {

    //Setup cache with "42", the answer for everything :)
    localStorage.setItem("anonymous-_Results", JSON.stringify({value: 42}));

    const dashInfo = new DashInfo(
        {validity: 5},
        () => {},
        null)

    let previousState

    retry(1000, 1, () => {
        try {
            expect(previousState).toBe('loading')
            expect(dashInfo.state).toBe('cache')
            expect(dashInfo.value).toBe(42)
            return true
        } catch (e) {
            previousState = dashInfo.state
            return false
        }
    }, done)
})

test.skip('DashInfo should only have a new value every *validity* seconds ', async () => {
    const countInfo = new DashInfo(
        {validity: 1},
        newCountCalls(),
        {offset: 0})

    try {
        expect(countInfo.value).toBeUndefined()

        await sleep(500)
        expect(countInfo.value).toBe(1)

        await sleep(200)
        expect(countInfo.value).toBe(1) // Shouldn't change

        await sleep(200)
        expect(countInfo.value).toBe(1) // Still shouldn't change

        await sleep(500)
        expect(countInfo.value).toBe(2) // CHANGE TIME !

        await sleep(500)
        expect(countInfo.value).toBe(2) // Shouldn't change

    } finally {
        countInfo.stopUpdates()
    }
})

test('TWO objects for the same info should only call ONE _getNewValue() every *validity* seconds ', () => {
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