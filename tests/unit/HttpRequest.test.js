/** @jest-environment node */
import {httpGet, httpPost} from "../../src/HttpRequest.js"

// A custom axios adapter lets us verify, without network access, that the
// axiosConfig given to httpGet/httpPost actually reaches axios.
const makeAdapter = (data, seen) => (config) => {
    seen.config = config
    return Promise.resolve({data, status: 200, statusText: "OK", headers: {}, config})
}

test('httpGet passes axiosConfig (headers, adapter, ...) through to axios', async () => {
    let seen = {}
    const results = await httpGet({
        url: "https://example.invalid/things",
        axiosConfig: {adapter: makeAdapter({ok: true}, seen), headers: {"X-Test": "abc"}}
    })

    expect(results.value).toEqual({ok: true})
    expect(seen.config.url).toBe("https://example.invalid/things")
    expect(seen.config.headers.get("X-Test")).toBe("abc")
})

test('httpPost passes data and axiosConfig through to axios', async () => {
    let seen = {}
    const results = await httpPost({
        url: "https://example.invalid/things",
        data: {welcome: "yes"},
        axiosConfig: {adapter: makeAdapter("created", seen), headers: {"X-Test": "xyz"}}
    })

    expect(results.value).toBe("created")
    expect(seen.config.url).toBe("https://example.invalid/things")
    expect(JSON.parse(seen.config.data)).toEqual({welcome: "yes"})
    expect(seen.config.headers.get("X-Test")).toBe("xyz")
})
