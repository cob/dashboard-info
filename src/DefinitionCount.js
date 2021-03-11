const { AbstractDefinitionInfo } = require("./AbstractDefinitionInfo");
const { getToken, setToken } = require("./Credentials")
const axios = require('axios');
axios.defaults.withCredentials = true

DefinitionCount = function()  { AbstractDefinitionInfo.apply(this, arguments) }
DefinitionCount.prototype = Object.create(AbstractDefinitionInfo.prototype);

DefinitionCount.prototype._getNewValue = function () {
  axios.defaults.headers.Cookie = getToken()
  return axios
    .get(this.server + this.queryUrl)
    .then(response => {
      setToken(response.headers["set-cookie"])
      return response.data.hits.total.value
    })
    .catch ( e => {
      console.log(e)
    })
}

module.exports = { DefinitionCount }