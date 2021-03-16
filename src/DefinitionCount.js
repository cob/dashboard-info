const { AbstractDefinitionInfo } = require("./AbstractDefinitionInfo");
const { rmDefinitionSearch } = require("@cob/rest-api-wrapper")

DefinitionCount = function()  { AbstractDefinitionInfo.apply(this, arguments) }
DefinitionCount.prototype = Object.create(AbstractDefinitionInfo.prototype);

DefinitionCount.prototype._getNewValue = function () {
  return rmDefinitionSearch(this.def,this.query)
    .then(response => {
      this.resultsUrl = response.resultsUrl
      return response.hits.total.value
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { DefinitionCount }