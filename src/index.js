const { auth, setServer } = require("@cob/rest-api-wrapper")

const {DefinitionCount} = require("./DefinitionCount")
const {DomainCount} = require("./DomainCount")
const {Instances} = require("./Instances")
const {FieldSum} = require("./FieldSum")
const {FieldDistinctValues} = require("./FieldDistinctValues")


module.exports = { DefinitionCount, DomainCount, Instances, FieldSum, FieldDistinctValues, auth, setServer };