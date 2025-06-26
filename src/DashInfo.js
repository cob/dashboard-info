import { umLoggedin } from "@cob/rest-api-wrapper"
import Storage from 'dom-storage'

if(typeof window == "undefined") {
  global.window = {
    addEventListener : () => {}
  }
  
  //Add support for localStorage in node
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
  }
}
window.CoBDasHDebug = window.CoBDasHDebug || {}
const DEBUG = window.CoBDasHDebug
// const DEBUG = {info:false} // CHANGE TO THIS TO RUN THE TESTS

const Loading  = "loading"
const Cache    = "cache"
const Updating = "updating"
const ReadyNew = "ready"
const ReadyOld = "cache"
const Error    = "error"
const MINIMAL_VALIDITY = 30000
const FAST_UPDATE = 200

const DashInfo = function({validity=0, changeCB, username, noDelays=false}, getterFunction, getterArgs) {

  if(username) {
    this.username = username
  } else if (typeof window !== 'undefined' && window.cob && window.cob.app.getCurrentLoggedInUser) {
      this.username = window.cob.app.getCurrentLoggedInUser()
  } else {
    this.username = "anonymous"
    umLoggedin().then( userInfo => this.username = userInfo.username )
  }

  if(DEBUG.info) this.uniqueId = Math.floor(Math.random() * Date.now()) // Just for debugging purposes
  this.updateCycle = validity != 0 // don't launch cycle if validity == 0
  this.refreshInterval = validity * 1000 // Specified in seconds 
  this.changeCB = changeCB
  this.currentState = Loading
  this.getterArgs = getterArgs || {}
  this.getterFunction = getterFunction
  this._timeoutProcess = null
  this.results = {value:undefined, href:undefined} // Expected minimal structure for getterFunction answers
  this.updating = false;
  this.noDelays = noDelays

  
  // Generate a unique id based on the getter function and its arguments.
  // The args can be literal objects when dealing with httpPost and httpGet, 
  // so we stringify them to avoid key conflicts between same concurrent calls
  const generateId = (func, args) => [
    func.name,
    ...Object.values(args).map(val => 
      (typeof val === 'object' && val !== null) ? JSON.stringify(val) : String(val)
    )
  ].join(" | ");

  Object.defineProperties(this, {
    "value": { "get": () => this.results.value },
    "state": { "get": () => this.currentState },
    "href": { "get": () => this.results.href },
    "id": { "get": () => generateId(getterFunction, this.getterArgs) },
    "cacheId": { "get": () => this.username + ' | ' + this.id }
  })
  
  // Quando num browser, parar de fazer Updates quando se sai da página actual. Deve ser feito pela app mas assim é garantido
  if(typeof window !== 'undefined') window.addEventListener('beforeunload', () => this.stopUpdates() )

  if(DEBUG.info) console.log("DASH: INFO: 0: initialized uniqueId=",this.uniqueId," cacheId=",this.cacheId," this=",this)

  if(this.noDelays) {
    this.startUpdates({start:false})
  } else {
    // Delay start to allow for changing arguments
    this._timeoutProcess = setTimeout( () => {
      if(!this.updating && this.currentState == Loading) {
        // only runs if no one else has done so
        this.startUpdates({start:false})
      }
    }, 10 )
  }
}

DashInfo.prototype.startUpdates = function ({start=true, forceUpdate=false}={}) {
  if(DEBUG.info) console.log("DASH: INFO: 2: startUpdates:  uniqueId=",this.uniqueId," cacheId=",this.cacheId,"start=",start)

  // If start=true then turn cycle on (but only if validity is not 0, which wouldn't make sense)
  if (start && this.refreshInterval != 0) this.updateCycle = true

  // Obtém valores da localStore (de um último acesso ou outro tab do mesmo browser)
  var storedResults = this._getFromLocalStorage(this.cacheId, "Results");
  if (storedResults != null && storedResults !== 'undefined') {
    if(JSON.stringify(this.results) != storedResults) {
      if(DEBUG.info) console.log("DASH: INFO: 2.1: startUpdates: init from cache ! uniqueId=",this.uniqueId," cacheId=",this.cacheId)
      this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
      this.currentState = Cache
      if(this.changeCB) this.changeCB(this.results)
    }
  }
  
  let fastCycle = false
  let currentSharedState = this._getFromLocalStorage(this.cacheId, "State")
  if( (currentSharedState == Loading || currentSharedState == Updating) && !this.updating && !this.stoppedWaitingForCache) {
    if(DEBUG.info) console.log("DASH: INFO: 2.2: startUpdates: wait for already running query uniqueId=",this.uniqueId," cacheId=",this.cacheId)
    this.waitingForCache = true
    this.currentState = currentSharedState
    if(!this.waitingForCacheDeadline) {
      if(DEBUG.info) console.log("DASH: INFO: 2.2.1: startUpdates: Set deadline ! uniqueId=",this.uniqueId," cacheId=",this.cacheId)
      this.waitingForCacheDeadline = Date.now() + 3000 // 3s is the limit to givin up and do a BE request (it can happen if a query is left in the middle)
    } else if( Date.now() > this.waitingForCacheDeadline ) {
      if(DEBUG.info) console.log("DASH: INFO: 2.2.2: startUpdates: waited to long. Do query next cycle ! uniqueId=",this.uniqueId," cacheId=",this.cacheId)
      this.stoppedWaitingForCache = true
      this.waitingForCache = false
      this.waitingForCacheDeadline = 0
    } 
    fastCycle = true;
  } else if(this.waitingForCache && !this.stoppedWaitingForCache) {
    if(DEBUG.info) console.log("DASH: INFO: 2.3: startUpdates: waiting over. Received cache  uniqueId=",this.uniqueId," cacheId=",this.cacheId)
    this.waitingForCache = false
    this.stoppedWaitingForCache = false
    this.waitingForCacheDeadline = 0
    this.currentState = Cache

  } else if(!this.updating) {
    if(DEBUG.info) console.log("DASH: INFO: 2.4: startUpdates: Eval the need for BE query. uniqueId=",this.uniqueId," cacheId=",this.cacheId)
  
    this.stoppedWaitingForCache = false
    //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
    let now = Date.now();
    let expirationTime = this._getFromLocalStorage(this.cacheId, "ExpirationTime"); //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão de outro tab
    if ( forceUpdate || typeof expirationTime === 'undefined' || now > expirationTime || expirationTime - now > this.refreshInterval ) {
      if(DEBUG.info) console.log("DASH: INFO: 2.5.1: startUpdates: Do BE query! uniqueId=",this.uniqueId," cacheId=",this.cacheId)

      let timeToExpire = this.refreshInterval > MINIMAL_VALIDITY || this.noDelays ? this.refreshInterval : MINIMAL_VALIDITY
      this._saveInLocalStorage(this.cacheId, "ExpirationTime", now + timeToExpire); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão de outro tab
      this.updating = true
      if(this.currentState != Loading) this.currentState = Updating
      this._saveInLocalStorage(this.cacheId, "State", this.currentState)

      this.getterFunction(this.getterArgs)
      .then( results => {  
        if(DEBUG.info) console.log("DASH: INFO: 2.5.2: startUpdates: BE query done. uniqueId=",this.uniqueId," cacheId=",this.cacheId,"results=",results)

        if(JSON.stringify(this.results) != JSON.stringify(results)) {
          if(DEBUG.info) console.log("DASH: INFO: 2.5.2.1: startUpdates: Ready ! Call changeCB. uniqueId=",this.uniqueId," cacheId=",this.cacheId, " results=",JSON.stringify(results))

          this.currentState = ReadyNew
          this.results = results
          if(this.changeCB) this.changeCB(results)
        } else {
          if(DEBUG.info) console.log("DASH: INFO: 2.5.2.2: startUpdates: ReadyOld ! uniqueId=",this.uniqueId," cacheId=",this.cacheId)

          this.currentState = ReadyOld
        } 
        this._saveInLocalStorage(this.cacheId, "Results", JSON.stringify(this.results))        
      })
      .catch( e => {
        if(DEBUG.info) console.log("DASH: INFO: 2.5.3: startUpdates: BE query error. uniqueId=",this.uniqueId," cacheId=",this.cacheId)

        this._saveInLocalStorage(this.cacheId, "ExpirationTime", 0)
        this.currentState = Error
        this.errorCode = e.response && e.response.status
      })
      .finally( () => {
        this.updating = false
        this._saveInLocalStorage(this.cacheId, "State", this.currentState)
      })
    } else {
      if(DEBUG.info) console.log("DASH: INFO: 2.6: startUpdates: BE query not needed yet. uniqueId=",this.uniqueId," cacheId=",this.cacheId)
    }
  }

  if(this.updateCycle || fastCycle) {
    if(DEBUG.info) console.log("DASH: INFO: 2.7: startUpdates: schedule next call uniqueId=",this.uniqueId," cacheId=",this.cacheId,)

    if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
    this._timeoutProcess = setTimeout( () => this.startUpdates({start:false}), fastCycle ? FAST_UPDATE : this.refreshInterval )
  }      
}

DashInfo.prototype.changeArgs = function (newArgs) {
  if(DEBUG.info) console.log("DASH: INFO: 1: changeArgs: uniqueId=",this.uniqueId," cacheId=",this.cacheId,"newArgs=",newArgs)

  for(const key in newArgs) this.getterArgs[key] = newArgs[key]
  this.update({force:false})
}

DashInfo.prototype.stopUpdates = function() {
  if(DEBUG.info) console.log("DASH: INFO: 3: stopUpdates  uniqueId=",this.uniqueId," cacheId=",this.cacheId)
  if(!this.waitingForCacheDeadline && this._timeoutProcess) {
    clearTimeout(this._timeoutProcess)
    this._timeoutProcess = null
  }
  this.updateCycle = false
}

DashInfo.prototype.update = function({force=true}={}) {
  if(DEBUG.info) console.log("DASH: INFO: 4: update  uniqueId=",this.uniqueId," cacheId=",this.cacheId, " force=",force)
  this.startUpdates({start:false, forceUpdate:force})
}

DashInfo.prototype._getStructureFromLocalStorage = function(key) {
  const value = localStorage.getItem(key)
  try {
    let structuredValue = value && JSON.parse(value) || {}
    return structuredValue || {}
  } catch (e) {
    console.warn("DASH: INFO: _getStructureFromLocalStorage: problem parsing json of key=", key, " value=", value)
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