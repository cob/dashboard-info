import { umLoggedin } from "@cob/rest-api-wrapper"
import Storage from 'dom-storage'

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

const DashInfo = function({validity=0, changeCB}, getterFunction, getterArgs) {
  this.validity = validity
  this.changeCB = changeCB
  this.currentState = Loading
  this.getterArgs = getterArgs || {}
  this.getterFunction = getterFunction
  this._getNewResults = () => this.getterFunction(this.getterArgs)
  this._timeoutProcess = null
  this.results = {value:undefined, href:undefined, state: Loading}
  Object.defineProperties(this, {
    "value":  { "get": () => this.results.value },
    "state":  { "get": () => this.currentState },
    "href":   { "get": () => this.results.href },
    "id":     { "get": () => [getterFunction.name,...Object.values(this.getterArgs)].join("_") },
    "cacheId":{ "get": () => this.username + '-' + this.id }
  })
  
  // Quando num browser, parar de fazer Updates quando se sai da página actual
  if(typeof window !== 'undefined') window.addEventListener('beforeunload', () => this.stopUpdates() )

  this.startUpdates()
}

DashInfo.prototype.changeArgs = function (newArgs) {
  for(const key in newArgs) this.getterArgs[key] = newArgs[key]
  this._getNewResults = () => this.getterFunction(this.getterArgs)
  this.update({force:false})
}

DashInfo.prototype.startUpdates = function ({start=true}={}) {
  if (this.stop && start) this.stop = false

  const processForUser = (username) => {
    // Obtem valores da localStore (de um último acesso ou outro tab do mesmo browser)
    this.username = username
    var storedResults = this._getFromLocalStorage(this.cacheId, "Results");
    if (storedResults != null && storedResults !== 'undefined') {
      if(JSON.stringify(this.results) != storedResults) {
        this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
        this.currentState = Cache
        if(this.changeCB) this.changeCB(this.results)
      }
    }
    
    //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
    let now = Date.now();
    let expirationTime = this._getFromLocalStorage(this.cacheId, "ExpirationTime") || 0; //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão
    if ( now > expirationTime || expirationTime - now > this.validity*1000 ) {
      this._saveInLocalStorage(this.cacheId, "ExpirationTime", now + this.validity*1000); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão
  
      if(this.currentState != Loading) this.currentState = Updating
      return this._getNewResults()
      .then( results => {
        if(JSON.stringify(this.results) != JSON.stringify(results)) {
          this.currentState = ReadyNew
          this.results = results
          if(this.changeCB) this.changeCB(results)
        } else {
          this.currentState = ReadyOld
        } 
        // Launch a new cycle if validity != 0 and this.stop is not true (either by explicitly being set or if an unload occurred)
        if(this.validity && !this.stop) {
          if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
          this._timeoutProcess = setTimeout( () => this.startUpdates({start:false}), this.validity * 1000)
        }
      })
      .catch( e => {
        this.currentState = Error
        this.errorCode = e.response && e.response.status
      })
      .finally( () => {
        if (typeof this.results !== 'undefined' && typeof this.results !== 'function') {
          this._saveInLocalStorage(this.cacheId, "Results", JSON.stringify(this.results))
        }
      })
    } else if ( storedResults == null) {
      // wait a little if cache is validity but still no results. This means there's another query running which still hasn't return values
      setTimeout( () => this.startUpdates({start:false}), 100)
    } else {
      // Value from cache but launch a new cycle also - if validity != 0 and this.stop is not true (either by explicitly being set or if an unload occurred) 
      if(this.validity && !this.stop) {
        if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
        this._timeoutProcess = setTimeout( () => this.startUpdates({start:false}), this.validity * 1000)
      }
    }
  }

  if (typeof window !== 'undefined' && window.cob && window.cob.app.getCurrentLoggedInUser) {
    processForUser(window.cob.app.getCurrentLoggedInUser())
  } else {
    return umLoggedin().then( ({username}) => processForUser(username) )
  }
}


DashInfo.prototype.stopUpdates = function() {
  this.stop = true
}

DashInfo.prototype.update = function({force=true}={}) {
  if(force) this._saveInLocalStorage(this.cacheId + " ExpirationTime", 0)
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
        console.warn("[Dashinfo]  localStorage full: cleaned")
      } catch (e) {
        // If, even with all storage available, we have an error, trim and log it 
        localStorage.setItem(key, newStructuredValueString.substring(0, 5000000) ) 
        console.error("[Dashinfo]  localStorage not enought for value=", newStructuredValueString)
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