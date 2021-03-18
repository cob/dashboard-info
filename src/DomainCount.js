const { AbstractInfo } = require("./AbstractInfo");
const { rmDomainSearch } = require("@cob/rest-api-wrapper")

DomainCount = function(domainId, notifyChangeCB, validity="180", query="*", cacheId="")  { 
  this.domainId = domainId
  if(!cacheId) cacheId = def + Math.floor(Math.random() * 100)
  AbstractInfo.apply(this, [cacheId, query, validity, notifyChangeCB] )
}
DomainCount.prototype = Object.create(AbstractInfo.prototype);

DomainCount.prototype._getNewValue = function () {
  return rmDomainSearch(this.domainId, this.query)
    .then(response => {
      this.resultsUrl = response.resultsUrl
      return response.hits.total.value
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { DomainCount }