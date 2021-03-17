/** @jest-environment node */
const { AbstractDefinitionInfo } = require("../src/AbstractDefinitionInfo")

test('new AbstractDefinitionInfo sets def and query ', () => {
    const mockUpdateCb = jest.fn()
    adi = new AbstractDefinitionInfo("b1","Countries Series", "*", 1, mockUpdateCb )
    expect(adi.def).toBe("Countries Series")
    expect(adi.query).toBe("*")
    adi.stopUpdates();
})

test('updating the query should force a _getNewValue call', () => {
    const mockUpdateCb = jest.fn()
    adi = new AbstractDefinitionInfo("c1","Countries Series", "query1", 1, mockUpdateCb )

    expect(adi.query).toBe("query1")
    adi.setQuery("query2")
    expect(adi.query).toBe("query2")
    adi.stopUpdates()
})