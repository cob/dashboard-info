// Shim for `node:https` imports, which jest 26 cannot resolve (needed by http-cookie-agent)
module.exports = require("https")
