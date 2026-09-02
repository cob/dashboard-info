/** @jest-environment node */
import DashInfo from "../../src/DashInfo.js"
import Storage from 'dom-storage'
import {jest} from '@jest/globals'

// In-memory storage, isolated from other test files
localStorage = new Storage(null, { strict: false })
beforeEach( () => localStorage.clear() )

const tick = () => new Promise( resolve => setImmediate(resolve) )

const newFlakyGetter = (name) => {
    // Fails with a 503 on the first call, succeeds afterwards
    let calls = 0
    const getter = () => {
        calls++
        return calls === 1
            ? Promise.reject({response: {status: 503}})
            : Promise.resolve({value: 7, href: "https://7"})
    }
    getter.id = name
    return getter
}

test('an explicit getter id takes precedence over the (minifiable) function name', () => {
    const getter = () => Promise.resolve({value: 1})
    Object.defineProperty(getter, 'name', {value: 'x', writable: false}) // like a minified name
    getter.id = "explicitId"

    let info = new DashInfo({validity: 0, noDelays: true, username: "tester"}, getter, {q: "abc"})
    try {
        expect(info.id).toBe("explicitId | abc")
        expect(info.cacheId).toBe("cob-dash-info | tester | explicitId | abc")
    } finally {
        info.stopUpdates()
    }
})

test('a query error sets state/errorCode AND notifies changeCB', async () => {
    const changeCB = jest.fn()
    let info = new DashInfo({validity: 0, noDelays: true, username: "tester", changeCB}, newFlakyGetter("behaviorTest1"))
    try {
        await tick()
        expect(info.state).toBe("error")
        expect(info.errorCode).toBe(503)
        expect(changeCB).toHaveBeenCalledTimes(1)
    } finally {
        info.stopUpdates()
    }
})

test('a successful update after an error clears errorCode and notifies changeCB with the new value', async () => {
    const changeCB = jest.fn()
    let info = new DashInfo({validity: 0, noDelays: true, username: "tester", changeCB}, newFlakyGetter("behaviorTest2"))
    try {
        await tick()
        expect(info.state).toBe("error")

        info.update() // force a new query, which now succeeds
        await tick()
        expect(info.state).toBe("ready")
        expect(info.errorCode).toBeUndefined()
        expect(info.value).toBe(7)
        expect(changeCB).toHaveBeenCalledTimes(2)
        expect(changeCB).toHaveBeenLastCalledWith({value: 7, href: "https://7"})
    } finally {
        info.stopUpdates()
    }
})

test('stopUpdates always clears a pending timer, even while waiting for another tab', async () => {
    const getter = () => Promise.resolve({value: 1})
    getter.id = "behaviorTest3"
    let info = new DashInfo({validity: 0, noDelays: true, username: "tester"}, getter)
    await tick()

    // Simulate the waiting-for-cache fast cycle state
    info.waitingForCacheDeadline = Date.now() + 3000
    info._timeoutProcess = setTimeout(() => {}, 5000)

    info.stopUpdates()
    expect(info._timeoutProcess).toBeNull()
    expect(info.updateCycle).toBe(false)
})
