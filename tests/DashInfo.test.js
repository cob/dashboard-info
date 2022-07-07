/** @jest-environment node */
import {jest} from '@jest/globals'
import DashInfo from 'src/DashInfo.js'
import repeat from 'tests/utils/Repeat.js';
import newCountCalls from 'tests/utils/NewCountCalls.js';
import Storage from 'node_modules/dom-storage/lib/index.js'
import sleep from 'src/utils/Sleep.js';
import domCount from 'src/lib/DomainCount.js';

// eslint-disable-next-line no-global-assign
localStorage = null

beforeEach(() => {
    // eslint-disable-next-line no-global-assign
    localStorage = new Storage('./tests/db.json', {strict: false, ws: '  '});
    localStorage.clear()
})

test('every DashInfo value starts by having the last cached value', async () => {

    //Setup cache with '42', the answer for everything :)
    localStorage.setItem('anonymous-_Results', JSON.stringify({value: 42}));

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

test('TWO objects for the same info should only call ONE _getNewValue() every *validity* seconds', async () => {

    const statesA = []
    const statesB = []

    const dashInfo_A = new DashInfo({validity: 1, onStateChange: (newState) => statesA.push(newState)},
        domCount,
        {query: 'Arab world', domainId: 2})

    await sleep(500)

    const dashInfo_B = new DashInfo({validity: 1, onStateChange: (newState) => statesB.push(newState)},
        domCount,
        {query: 'Arab world', domainId: 2})

    await sleep(2000)

    dashInfo_A.stopUpdates()
    dashInfo_B.stopUpdates()

    expect(dashInfo_A.value).toStrictEqual(dashInfo_B.value)

    expect(statesA.filter(state => state === 'updating').length).toBeGreaterThanOrEqual(1)
    expect(statesB.filter(state => state === 'updating')).toHaveLength(0)
})

test('if no cache available (no mem or no localstorage) it work without cache', () => {
    // eslint-disable-next-line no-global-assign
    localStorage = null
})


test('if no cache available (ocalstorage quota exceeded) tries to clear up some memory', async () => {

    jest.spyOn(console, 'warn').mockImplementation(() => {});

    //Setup cache with '42', the answer for everything :)
    localStorage.setItem('test-_Results', JSON.stringify({value: 42}));
    localStorage.setItem('test-_ExpirationTime', '0');

    // Proxy the request but the fail on the first try to set the item
    let throwError = true
    localStorage.originalSetItem = localStorage.setItem
    localStorage.setItem = function(key, value) {
        if (throwError) {
            throwError = false
            throw new Error("Quota exceeded !")
        }

        localStorage.originalSetItem(key, value)
    }

    const dashInfo = new DashInfo({validity: 1}, domCount, {query: 'Europe', domainId: 2})

    try {
        await sleep(1000)
        expect(dashInfo.value).toStrictEqual(142)

        expect(localStorage.getItem("test-_Results")).toBeNull()
        expect(localStorage.getItem("test-_ExpirationTime")).toBeNull()

        expect(localStorage.getItem("anonymous-domainCount_Europe_2_ExpirationTime")).not.toBeNull()

    } finally {
        dashInfo.stopUpdates()
    }
})

test('changing querys for "countries series" from "Arab world" to "united" should change 20 to 60', async () => {

    const dashInfo = new DashInfo({validity: 1}, domCount, {query: 'Arab world', domainId: 2})

    try {
        await sleep(1000)
        expect(dashInfo.value).toStrictEqual(22)

        dashInfo.changeArgs({query: 'united', domainId: 2})

        await sleep(1000)
        expect(dashInfo.value).toStrictEqual(66)

    } finally {
        dashInfo.stopUpdates()
    }
})