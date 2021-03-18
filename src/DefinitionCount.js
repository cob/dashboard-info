const { AbstractInfo } = require("./AbstractInfo");
const { rmDefinitionSearch } = require("@cob/rest-api-wrapper")

DefinitionCount = function(def, notifyChangeCB, validity="180", query="*",  cacheId="")  { 
  this.def = def
  if(!cacheId) cacheId = def + Math.floor(Math.random() * 100)
  AbstractInfo.apply(this, [cacheId, query, validity, notifyChangeCB] )
}
DefinitionCount.prototype = Object.create(AbstractInfo.prototype);

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