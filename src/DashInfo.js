import { umLoggedin } from "@cob/rest-api-wrapper"
import Storage from 'dom-storage'

window.CoBDasHDebug = window.CoBDasHDebug || {}
const DEBUG = window.CoBDasHDebug

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
}

const Loading  = "loading"
const Cache    = "cache"
const Updating = "updating"
const ReadyNew = "ready"
const ReadyOld = "cache"
const Error    = "error"

const DashInfo = function({validity=0, changeCB, username}, getterFunction, getterArgs) {

  if(username) {
    this.username = username
  } else if (typeof window !== 'undefined' && window.cob && window.cob.app.getCurrentLoggedInUser) {
      this.username = window.cob.app.getCurrentLoggedInUser()
  } else {
    this.username = "anonymous"
    umLoggedin().then( userInfo => this.username = userInfo.username )
  }

  this.startDate = Date.now() // Just for debugging purposes
  this.updateCycle = validity != 0 // don't launch cycle if validity == 0
  this.validity = validity * 1000 // Specified in seconds 
  this.changeCB = changeCB
  this.currentState = Loading
  this.getterArgs = getterArgs || {}
  this.getterFunction = getterFunction
  this._getNewResults = () => this.getterFunction(this.getterArgs)
  this._timeoutProcess = null
  this.results = {value:undefined, href:undefined} // Expected minimal structure for getterFunction answers
  Object.defineProperties(this, {
    "value":  { "get": () => this.results.value },
    "state":  { "get": () => this.currentState },
    "href":   { "get": () => this.results.href },
    "id":     { "get": () => [getterFunction.name,...Object.values(this.getterArgs)].join("_") },
    "cacheId":{ "get": () => this.username + '-' + this.id }
  })
  
  // Quando num browser, parar de fazer Updates quando se sai da página actual
  if(typeof window !== 'undefined') window.addEventListener('beforeunload', () => this.stopUpdates() )

  if(DEBUG.info) console.log("DASH: INFO: 0: initialized startDate=",this.startDate," cacheId=",this.cacheId," this=",this)

  this.startUpdates()
}

DashInfo.prototype.changeArgs = function (newArgs) {
  if(DEBUG.info) console.log("DASH: INFO: 1: changeArgs: startDate=",this.startDate," cacheId=",this.cacheId,"newArgs=",newArgs)

  for(const key in newArgs) this.getterArgs[key] = newArgs[key]
  this._getNewResults = () => this.getterFunction(this.getterArgs)
  this.update({force:false})
}

DashInfo.prototype.startUpdates = function ({start=true}={}) {
  if(DEBUG.info) console.log("DASH: INFO: 2: startUpdates: ! startDate=",this.startDate," cacheId=",this.cacheId,"start=",start)

  // If cycle is stoped but start=true then turn it on (but only if validity is not 0, which wouldn't make sense)
  if (start && !this.updateCycle && this.validity != 0) this.updateCycle = true

  // Obtem valores da localStore (de um último acesso ou outro tab do mesmo browser)
  var storedResults = this._getFromLocalStorage(this.cacheId, "Results");
  if (storedResults != null && storedResults !== 'undefined') {
    if(JSON.stringify(this.results) != storedResults) {
      if(DEBUG.info) console.log("DASH: INFO: 2.0.0: startUpdates: update from cache ! startDate=",this.startDate," cacheId=",this.cacheId)
      this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
      this.currentState = Cache
      if(this.changeCB) this.changeCB(this.results)
    }
  }
  
  //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
  let now = Date.now();
  let expirationTime = this._getFromLocalStorage(this.cacheId, "ExpirationTime"); //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão
  if ( typeof expirationTime === 'undefined' || now > expirationTime || expirationTime - now > this.validity ) {
    this._saveInLocalStorage(this.cacheId, "ExpirationTime", now + this.validity); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão
    if(DEBUG.info) console.log("DASH: INFO: 2.0.1: startUpdates: Do BE query! startDate=",this.startDate," cacheId=",this.cacheId)

    if(this.currentState != Loading) this.currentState = Updating

    this._getNewResults().then( results => {
      if(DEBUG.info) console.log("DASH: INFO: 2.1: startUpdates: BE query done! startDate=",this.startDate," cacheId=",this.cacheId,"results=",results)

      if(JSON.stringify(this.results) != JSON.stringify(results)) {
        if(DEBUG.info) console.log("DASH: INFO: 2.1.1: startUpdates: Ready & update ! startDate=",this.startDate," cacheId=",this.cacheId, " results=",JSON.stringify(results))
        this.currentState = ReadyNew
        this.results = results
        this._saveInLocalStorage(this.cacheId, "Results", JSON.stringify(this.results))        
        if(this.changeCB) this.changeCB(results)
      } else {
        if(DEBUG.info) console.log("DASH: INFO: 2.1.2: startUpdates: ReadyOld ! startDate=",this.startDate," cacheId=",this.cacheId)
        this.currentState = ReadyOld
      } 
    })
    .catch( e => {
      if(DEBUG.info) console.log("DASH: INFO: 2.2: startUpdates: error getting update startDate=",this.startDate," cacheId=",this.cacheId)
      this.currentState = Error
      this.errorCode = e.response && e.response.status
    })
    .finally( () => {
      this._saveInLocalStorage(this.cacheId, "State", JSON.stringify(this.currentState))        
    })
  } else {
    if( !this._getFromLocalStorage(this.cacheId, "State") ) {
      if(DEBUG.info) console.log("DASH: INFO: 2.3: startUpdates: wait runningquery startDate=",this.startDate," cacheId=",this.cacheId)
      setTimeout( () => this.startUpdates({start:false}), 50 )
    }
  }
  
  if(this.updateCycle) {
    if(DEBUG.info) console.log("DASH: INFO: 2.4: startUpdates: schedule next call startDate=",this.startDate," cacheId=",this.cacheId,)
    if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
    this._timeoutProcess = setTimeout( () => this.startUpdates({start:false}), this.validity )
  }
}

DashInfo.prototype.stopUpdates = function() {
  if(DEBUG.info) console.log("DASH: INFO: 3: stopUpdates  startDate=",this.startDate)
  if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
  this.updateCycle = false
}

DashInfo.prototype.update = function({force=true}={}) {
  if(DEBUG.info) console.log("DASH: INFO: 4: update  startDate=",this.startDate," cacheId=",this.cacheId, " force=",force)
  if(force) this._saveInLocalStorage(this.cacheId, "ExpirationTime", 0)
  this.startUpdates()
}

DashInfo.prototype._getStructureFromLocalStorage = function(key) {
  const value = localStorage.getItem(key)
  try {
    let structuredValue = value && JSON.parse(value) || {}
    return structuredValue || {}
  } catch (e) {
    console.warn("[Dashinfo] problem parsing json of key=", key, " value=", value)
  }
  return  {}
}

DashInfo.prototype._getFromLocalStorage = function(key,part) {
  let structuredValue = this._getStructureFromLocalStorage(key)
  return structuredValue[part]
}

DashInfo.prototype._saveInLocalStorage = function(key,part,value) {
  let structuredValue = this._getStructureFromLocalStorage(key)
  structuredValue[part] = value
  const newStructuredValueString = JSON.stringify(structuredValue)
  try {
    localStorage.setItem(key, newStructuredValueString) 
  } catch {
    // Clean expired information
    this._cleanStore() 
    try {
      // Try again, to see if removing expired entries was enougth 
      localStorage.setItem(key, newStructuredValueString) 
    } catch (e) {
      // If it was not, them clear all cache and try again
      localStorage.clear()
      try {
        localStorage.setItem(key, newStructuredValueString) 
        console.warn("DASH: INFO: _saveInLocalStorage: localStorage full: cleaned")
      } catch (e) {
        // If, even with all storage available, we have an error, trim and log it 
        localStorage.setItem(key, newStructuredValueString.substring(0, 5000000) ) 
        console.error("DASH: INFO: _saveInLocalStorage: localStorage not enought for value=", newStructuredValueString)
      } 
    }
  }
}

DashInfo.prototype._cleanStore = function() {
  // Clean all stored for more then 5 days
  let now = Date.now()
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    let key = localStorage.key(i);
    let expirationTime = this._getFromLocalStorage(key,"ExpirationTime");
    if (expirationTime && expirationTime < now) {
      localStorage.removeItem(key);
    }
  }
}

export default DashInfo