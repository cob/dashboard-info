const { AbstractInfo } = require("./AbstractInfo");
const axios = require('axios');

AbstractDefinitionInfo = function(cacheId, def, query, validity, notifyChangeCB)  { 
  this.def = def
  this.query = query
  AbstractInfo.apply(this, [cacheId, validity, notifyChangeCB] )
}
AbstractDefinitionInfo.prototype = Object.create(AbstractInfo.prototype);

AbstractDefinitionInfo.prototype.setQuery =function (query) {
  this.query = query 
  this.forceRefresh()
}

module.exports = { AbstractDefinitionInfo }