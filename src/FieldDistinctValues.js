
const { AbstractInfo } = require("./AbstractInfo");
const { rmDefinitionAdvSearch } = require("@cob/rest-api-wrapper")

FieldDistinctValues = function(defId, fieldName, notifyChangeCB, validity="180", query="*", size=50, cacheId="")  { 
  this.defId = defId
  this.fieldName = fieldName.endsWith(".raw") ? fieldName : fieldName + ".raw"
  this.size = size
  if(!cacheId) cacheId = defId + Math.floor(Math.random() * 100)
  AbstractInfo.apply(this, [cacheId, query, validity, notifyChangeCB] )
}
FieldDistinctValues.prototype = Object.create(AbstractInfo.prototype);

FieldDistinctValues.prototype._getNewValue = function () {
  let agg = {
    "x": {
      "terms": {
        "field": this.fieldName,
        "size": this.size
      }
    }
  }
  return rmDefinitionAdvSearch(this.defId, agg , this.query)
  .then(response => {
      this.resultsUrl = response.resultsUrl
      return response.aggregations['sterms#x'].buckets.map(e => e.key)
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { FieldDistinctValues }