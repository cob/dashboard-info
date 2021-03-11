const { AbstractDefinitionInfo } = require("./AbstractDefinitionInfo");
const { getToken, setToken } = require("./Credentials")
const axios = require('axios');
axios.defaults.withCredentials = true

Instances = function()  { 
  // We need to delay the AbstractInfo launch of _updateValueCycle because
  // after calling the super constructor AbstractDefinitionInfo, which will setup the quertUrl,
  // we still need to change that query.
  this.delayUpdateCycle = true

  AbstractDefinitionInfo.apply(this, arguments) 
  this.queryUrl = this.queryUrl.replace('&size=0&','&size=500&')

  // now we can launch the update cycle
  this._updateValueCycle()
}
Instances.prototype = Object.create(AbstractDefinitionInfo.prototype);

Instances.prototype._getNewValue = function () {
  axios.defaults.headers.Cookie = getToken()
  return axios
    .get(this.server + this.queryUrl)
    .then(response => {
      setToken(response.headers["set-cookie"])
      return response.data.hits.hits.map(e => e._source)
    })
    .catch ( e => {
      console.log(e)
    })
}

module.exports = { Instances }