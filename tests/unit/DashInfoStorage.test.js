/** @jest-environment node */
import DashInfo from "../../src/DashInfo.js"
import newCountCalls from "../CountCalls.js"
import Storage from 'dom-storage'

// In-memory storage, isolated from other test files
localStorage = new Storage(null, { strict: false })
beforeEach( () => localStorage.clear() )

const PREFIX = "cob-dash-info | "
const newInfo = (name) => new DashInfo({validity: 0, noDelays: true, username: "tester"}, newCountCalls(0, name))

test('cacheId is prefixed with the library namespace', () => {
    let info = newInfo("storageTest1")
    try {
        expect(info.cacheId).toBe(PREFIX + "tester | storageTest1")
    } finally {
        info.stopUpdates()
    }
})

test('_ownStoreKeys only returns keys created by the library', () => {
    let info = newInfo("storageTest2")
    try {
        localStorage.setItem("hostAppKey", "precious host data")
        localStorage.setItem(PREFIX + "tester | other", JSON.stringify({}))

        const ownKeys = info._ownStoreKeys()
        expect(ownKeys).toContain(PREFIX + "tester | other")
        expect(ownKeys).toContain(PREFIX + "tester | storageTest2")
        expect(ownKeys).not.toContain("hostAppKey")
    } finally {
        info.stopUpdates()
    }
})

test('_cleanStore removes ALL expired library entries and nothing else', () => {
    let info = newInfo("storageTest3")
    try {
        const now = Date.now()

        // Several consecutive expired entries: the old index-based loop skipped
        // entries because removal shifts localStorage indexes while iterating
        for (let i = 0; i < 5; i++) {
            localStorage.setItem(PREFIX + "tester | expired" + i, JSON.stringify({ExpirationTime: now - 1000}))
        }
        localStorage.setItem(PREFIX + "tester | fresh", JSON.stringify({ExpirationTime: now + 60000}))
        localStorage.setItem("hostAppKey", "precious host data")

        info._cleanStore()

        for (let i = 0; i < 5; i++) {
            expect(localStorage.getItem(PREFIX + "tester | expired" + i)).toBeNull()
        }
        expect(localStorage.getItem(PREFIX + "tester | fresh")).not.toBeNull()
        expect(localStorage.getItem("hostAppKey")).toBe("precious host data")
    } finally {
        info.stopUpdates()
    }
})

// ---------------------------------------------------------------------------------------------------------------
// Not enough localStorage: like in the browsers, setItem throws QuotaExceededError when keys + values go over a limit
// (Safari: 5 MB, that is ~2.6M chars, shared with everything else of the same origin)
class QuotaStorage extends Storage {
    constructor(limitChars) {
        super(null, { strict: false })
        Object.defineProperty(this, "limitChars", { value: limitChars, enumerable: false })
    }
    setItem(key, value) {
        let used = 0
        for (const k of Object.keys(this)) if (k !== String(key)) used += k.length + String(this.getItem(k)).length
        if (used + String(key).length + String(value).length > this.limitChars) throw new DOMException("quota", "QuotaExceededError")
        super.setItem(key, value)
    }
}

// A getter that never answers: the tests only exercise the storage
function neverAnswers() { return new Promise( () => {} ) }
const newQuotaInfo = (limitChars) => {
    localStorage = new QuotaStorage(limitChars)
    return new DashInfo({validity: 0, noDelays: true, username: "tester"}, neverAnswers)
}
// An entry of the cache with exactly `size` chars (key + value)
const putEntry = (name, size, {expiration, state = "ready"} = {}) => {
    const key = PREFIX + "tester | " + name
    const empty = JSON.stringify({ExpirationTime: expiration, State: state, Results: ""})
    localStorage.setItem(key, JSON.stringify({ExpirationTime: expiration, State: state, Results: "r".repeat(size - key.length - empty.length)}))
    return key
}

test('when there is no room it evicts only library entries, the ones that expire first, and stores the value', () => {
    const info = newQuotaInfo(1000)
    try {
        localStorage.clear()
        const now = Date.now()
        localStorage.setItem("hostAppKey", "h".repeat(100))
        const a = putEntry("a", 250, {expiration: now + 1000})
        const b = putEntry("b", 250, {expiration: now + 5000})
        const c = putEntry("c", 250, {expiration: now + 9000})

        // 100 + 750 used of 1000: the new value (~400) only fits after evicting one entry
        expect(() => info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(300))).not.toThrow()

        expect(localStorage.getItem(info.cacheId)).not.toBeNull()
        expect(localStorage.getItem(a)).toBeNull()          // the first to expire went
        expect(localStorage.getItem(b)).not.toBeNull()      // the others stayed: no "clear everything"
        expect(localStorage.getItem(c)).not.toBeNull()
        expect(localStorage.getItem("hostAppKey")).toBe("h".repeat(100))
    } finally {
        info.stopUpdates()
    }
})

test('entries being updated right now (maybe by another tab) are evicted last', () => {
    const info = newQuotaInfo(1000)
    try {
        localStorage.clear()
        const now = Date.now()
        const inFlight = putEntry("inFlight", 250, {expiration: now + 1000, state: "updating"})
        const ready = putEntry("ready", 250, {expiration: now + 9000})
        localStorage.setItem("hostAppKey", "h".repeat(300))

        // 800 used of 1000: the new value (~350) only fits after evicting one entry
        info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(300))

        expect(localStorage.getItem(info.cacheId)).not.toBeNull()
        expect(localStorage.getItem(ready)).toBeNull()      // evicted first, even if it expires later
        expect(localStorage.getItem(inFlight)).not.toBeNull()
    } finally {
        info.stopUpdates()
    }
})

test('a value that does not fit at all never throws, is not stored (not even truncated) and keeps the host keys', () => {
    const info = newQuotaInfo(500)
    try {
        localStorage.clear()
        localStorage.setItem("hostAppKey", "h".repeat(100))
        const other = putEntry("other", 150, {expiration: Date.now() + 5000})

        expect(() => info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(2000))).not.toThrow()

        expect(localStorage.getItem(info.cacheId)).toBeNull()
        expect(localStorage.getItem("hostAppKey")).toBe("h".repeat(100))
        // every entry that is left is valid JSON (the old fallback stored a truncated string)
        info._ownStoreKeys().forEach( k => expect(() => JSON.parse(localStorage.getItem(k))).not.toThrow() )
        expect(other).toBeTruthy()
    } finally {
        info.stopUpdates()
    }
})

test('after a value did not fit, the next refreshes of the same query do not empty the cache again', () => {
    const info = newQuotaInfo(500)
    try {
        localStorage.clear()
        info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(2000)) // does not fit: remembered
        const other = putEntry("other", 150, {expiration: Date.now() + 5000})

        info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(2000)) // the same again

        expect(localStorage.getItem(other)).not.toBeNull()  // not evicted just to fail again
    } finally {
        info.stopUpdates()
    }
})

test('the state and expiration of a query still get stored when its results do not fit', () => {
    const info = newQuotaInfo(500)
    try {
        localStorage.clear()
        info._saveInLocalStorage(info.cacheId, "Results", "n".repeat(2000))
        info._saveInLocalStorage(info.cacheId, "State", "ready")
        info._saveInLocalStorage(info.cacheId, "ExpirationTime", 123)

        expect(info._getFromLocalStorage(info.cacheId, "State")).toBe("ready")
        expect(info._getFromLocalStorage(info.cacheId, "ExpirationTime")).toBe(123)
        expect(info._getFromLocalStorage(info.cacheId, "Results")).toBeUndefined()
    } finally {
        info.stopUpdates()
    }
})
