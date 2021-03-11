const axios = require('axios');

var loginUsername = ""
var server = ""
var token = []

var getLogin = function() {
  if(typeof cob !== 'undefined' && cob.app && cob.app.getCurrentLoggedInUser) {
    return cob.app.getCurrentLoggedInUser()
  } else {
    return loginUsername
  }
}

var login = function (username, password) {
  loginUsername = ""
  if(username == "anonymous") {
    loginUsername = username
    return
  }
  return axios
    .post(getServer() + "/recordm/security/auth", {
      username: username,
      password: password
    })
    .then(response => {
      loginUsername = username
      setToken(response.headers["set-cookie"])
    })
    .catch ( e => {
      console.log("Failed login: " + e)
    })
}

var setToken = function (newToken, associatedUsername) {
  if(associatedUsername) loginUsername = associatedUsername
  token = newToken
}

var getToken = function () {
  return(token || "")
}

var getServer = function() {
  if(server) {
    return server
  } else if(false /* TODO: check server from enviroment (browser or node) */) {
    server = (request.server)
  } else {
    server = "https://learning.cultofbits.com"
  }
  return server
}

var setServer = function(newServer) {
  server = newServer
}


module.exports = { getServer, setServer, login, getToken, setToken, getLogin };