const { login, setServer, setToken } = require("./Credentials")

const {DomainCount} = require("./DomainCount")
const {DefinitionCount} = require("./DefinitionCount")
const {Instances} = require("./Instances")


module.exports = { DomainCount, DefinitionCount, Instances, login, setServer, setToken };