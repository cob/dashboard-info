const { AbstractDomainInfo } = require("./AbstractDomainInfo");
const { getToken, setToken } = require("./Credentials")
const axios = require('axios');
axios.defaults.withCredentials = true

DomainCount = function()  { AbstractDomainInfo.apply(this, arguments) }
DomainCount.prototype = Object.create(AbstractDomainInfo.prototype);

DomainCount.prototype._getNewValue = function () {
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

module.exports = { DomainCount }