const { AbstractInfo } = require("./AbstractInfo");
const axios = require('axios');

const QueryURLTemplate =  "/recordm/recordm/definitions/search/name/__DEF_NAME__?from=0&size=0&q=__QUERY__"
const ResultsURLTemplate = "/recordm/#/definitions/__DEF_ID__/q=__QUERY__"

AbstractDefinitionInfo = function(cacheId, def, query, validity, notifyChangeCB)  { 
  this.def = def
  this.delayUpdateCycle = true
  AbstractInfo.apply(this, [cacheId, validity, notifyChangeCB] )
  this.setQuery(query)
  this._updateValueCycle()
}
AbstractDefinitionInfo.prototype = Object.create(AbstractInfo.prototype);

AbstractDefinitionInfo.prototype.setQuery =function (query) {
  this.queryUrl = QueryURLTemplate
    .replace('__DEF_NAME__',this.def)
    .replace('__QUERY__',query)

  axios
    .get(this.server + "/recordm/recordm/definitions/name/" + this.def)
    .then(response => {
      let defId = response.data.id
      this.resultsURL = ResultsURLTemplate
        .replace('__DEF_ID__', defId)
        .replace('__QUERY__', this.query);
    })
    .catch(e => {
      console.log(e)
    })
  
  this.forceRefresh()
}

module.exports = { AbstractDefinitionInfo }