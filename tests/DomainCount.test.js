/** @jest-environment node */
import domainCount from "../src/DomainCount.js"

test('for learning app, demo domain count for "Arab world" is 22', (done) => {
    domainCount( { domainId:2, query:"Arab world"} )
    .then( results => {
        expect(results.value).toBe(22)
        expect(results.href).toBe("https://learning.cultofbits.com/recordm/#/domain/2/q=Arab world")
        done()
    })
    .catch( e => {
        done(e)
    })
})