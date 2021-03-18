const { AbstractInfo } = require("./AbstractInfo");
const { rmDefinitionSearch } = require("@cob/rest-api-wrapper")

Instances = function(def, notifyChangeCB, validity="180", query="*", size=10, cacheId="")  { 
  this.def = def
  this.size = size
  if(!cacheId) cacheId = def + Math.floor(Math.random() * 100)
  AbstractInfo.apply(this, [cacheId, query, validity, notifyChangeCB] )
}
Instances.prototype = Object.create(AbstractInfo.prototype);

Instances.prototype._getNewValue = function () {
  return rmDefinitionSearch(this.def,this.query, 0, this.size)
    .then(results => {
      return results.hits.hits.map(e => e._source)
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { Instances }