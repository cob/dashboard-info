
const { AbstractInfo } = require("./AbstractInfo");
const { rmDefinitionAdvSearch } = require("@cob/rest-api-wrapper")

FieldSum = function(defId, fieldName, notifyChangeCB, validity="180", query="*",  cacheId="")  { 
  this.defId = defId
  this.fieldName = fieldName
  if(!cacheId) cacheId = defId + Math.floor(Math.random() * 100)
  AbstractInfo.apply(this, [cacheId, query, validity, notifyChangeCB] )
}
FieldSum.prototype = Object.create(AbstractInfo.prototype);

FieldSum.prototype._getNewValue = function () {
  let agg = {
    "x": {
      "sum": {
        "field": this.fieldName
      }
    }
  }
  return rmDefinitionAdvSearch(this.defId, agg , this.query)
  .then(response => {
      this.resultsUrl = response.resultsUrl
      return response.aggregations["sum#x"].value
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { FieldSum }