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
