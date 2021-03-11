const { AbstractInfo } = require("./AbstractInfo");

const QueryURLTemplate =  "/recordm/recordm/domains/search/__DOMAIN_ID__?from=0&size=0&q=__QUERY__"
const ResultsURLTemplate = "/recordm/#/domain/__DOMAIN_ID__/q=__QUERY__"

AbstractDomainInfo = function(cacheId, domainId, query, validity, notifyChangeCB)  { 
  this.domainId = domainId
  this.setQuery(query)
  AbstractInfo.apply(this, [cacheId, validity, notifyChangeCB] )
}
AbstractDomainInfo.prototype = Object.create(AbstractInfo.prototype);

AbstractDomainInfo.prototype.setQuery =function (query) {
  this.queryUrl = QueryURLTemplate
    .replace('__DOMAIN_ID__',this.domainId)
    .replace('__QUERY__',query)

  this.resultsURL = ResultsURLTemplate
    .replace('__DOMAIN_ID__',this.defId)
    .replace('__QUERY__',this.query);

  this.forceRefresh()
}

module.exports = { AbstractDomainInfo }