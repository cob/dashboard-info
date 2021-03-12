const { getServer, setServer } = require("../src/Credentials")


test('default server is learning.cultofbits.com', () => {
    expect(getServer()).toBe("https://learning.cultofbits.com");
});

test('getServer equals previous setServer', () => {
    setServer("https://xpto.cultofbits.com")
    expect(getServer()).toBe("https://xpto.cultofbits.com");
});