/** @jest-environment node */
import {httpGet, httpPost} from "../src/HttpRequest.js"

test('can make an get http request', (done) => {
    httpGet({url: "https://jsonplaceholder.typicode.com/posts"})
        .then(results => {
            expect(results.value.length).toBeGreaterThan(10)
            done()
        })
        .catch(e => {
            done(e)
        })
})

test('can make a post http request', (done) => {
    httpPost({url: "https://httpbin.org/anything", data: {"welcome": "yes"}})
        .then(results => {
            expect(results.value.method).toBe("POST")
            expect(JSON.parse(results.value.data)).toEqual({"welcome": "yes"})
            done()
        })
        .catch(e => {
            done(e)
        })
})