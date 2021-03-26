/** @jest-environment node */
import domainCount from "../src/DomainCount.js"

test('for learning app, demo domain count for "Arab world" is 22', () => {
    domainCount(2, "Arab world" )
    .then( results => {
        expect(results.value).toBe(22)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/domain/2/q=Arab world")
    })
})