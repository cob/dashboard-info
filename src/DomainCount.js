const { AbstractInfo } = require("./AbstractInfo");
const { rmDomainSearch } = require("@cob/rest-api-wrapper")

const QueryURLTemplate =  "/recordm/recordm/domains/search/__DOMAIN_ID__?from=0&size=0&q=__QUERY__"
const ResultsURLTemplate = "/recordm/#/domain/__DOMAIN_ID__/q=__QUERY__"

DomainCount = function(cacheId, domainId, query, validity, notifyChangeCB)  { 
  this.domainId = domainId
  this.setQuery(query)
  AbstractInfo.apply(this, [cacheId, validity, notifyChangeCB] )
}
DomainCount.prototype = Object.create(AbstractInfo.prototype);


AbstractDefinitionInfo.prototype.setQuery =function (query) {
  this.query = query 
  this.forceRefresh()
}


DomainCount.prototype._getNewValue = function () {
  return rmDomainSearch(this.domainId,this.query)
    .then(response => {
      this.resultsUrl = response.resultsUrl
      return response.hits.total.value
    })
    .catch ( e => {
      throw(e)
    })
}

module.exports = { DomainCount }