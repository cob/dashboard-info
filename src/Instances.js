const { AbstractDefinitionInfo } = require("./AbstractDefinitionInfo");
const { rmDefinitionSearch } = require("@cob/rest-api-wrapper")

Instances = function()  { AbstractDefinitionInfo.apply(this, arguments) }
Instances.prototype = Object.create(AbstractDefinitionInfo.prototype);

Instances.prototype._getNewValue = function () {
  return rmDefinitionSearch(this.def,this.query, 0, 10)
    .then(results => {
      return results.hits.hits.map(e => e._source)
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { Instances }