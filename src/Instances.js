const { AbstractDefinitionInfo } = require("./AbstractDefinitionInfo");
const { getToken, setToken } = require("./Credentials")
const axios = require('axios');
axios.defaults.withCredentials = true

Instances = function()  { AbstractDefinitionInfo.apply(this, arguments) }
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