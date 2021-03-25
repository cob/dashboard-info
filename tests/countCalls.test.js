import newCountCalls from "./CountCalls.js";

test('each call to a countCalls increses 1', async () => {
    let countCalls = newCountCalls()
    countCalls().then ( v => expect(v.value).toBe(1) )
    countCalls().then ( v => expect(v.value).toBe(2) )
    countCalls().then ( v => expect(v.value).toBe(3) )
    countCalls().then ( v => expect(v.value).toBe(4) )
})

test('each newCountCalls returns a countCall function that starts in 1', async () => {
    let countCalls = newCountCalls()
    countCalls().then ( v => expect(v.value).toBe(1) )
    countCalls().then ( v => expect(v.value).toBe(2) )
    countCalls().then ( v => expect(v.value).toBe(3) )
    countCalls().then ( v => expect(v.value).toBe(4) )
})

test('countCall return a null href ', async () => {
    let countCalls = newCountCalls("testCacheId")
    countCalls().then ( v => expect(v.href).toBe(null) )
})
