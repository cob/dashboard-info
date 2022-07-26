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
  if(this.stop && start) this.stop = false
  return umLoggedin().then( ({username}) => {
    // Obtem valores da localStore (de um último acesso ou outro tab do mesmo browser)
    this.username = username
    var storedResults = localStorage.getItem(this.cacheId + "_Results");
    if (storedResults != null && storedResults !== 'undefined') {
      this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
      this.currentState = Cache
      if(this.changeCB) this.changeCB(this.results)
    }
    
    //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
    let now = Date.now();
    let expirationTime = localStorage.getItem(this.cacheId + "_ExpirationTime") || 0; //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão
    if ( now > expirationTime || expirationTime - now > this.validity*1000 || storedResults == null ) {
      this._saveInLocalStorage(this.cacheId + "_ExpirationTime", now + this.validity*1000); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão
  
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
          this._saveInLocalStorage(this.cacheId + "_Results", JSON.stringify(this.results))
        }
      })
    } else {
      // Value from cache but launch a new cycle also - if validity != 0 and this.stop is not true (either by explicitly being set or if an unload occurred) 
      if(this.validity && !this.stop) {
        if(this._timeoutProcess) clearTimeout(this._timeoutProcess)
        this._timeoutProcess = setTimeout( () => this.startUpdates({start:false}), this.validity * 1000)
      }
    }
  })
}

DashInfo.prototype.stopUpdates = function() {
  this.stop = true
}

DashInfo.prototype.update = function({force=true}={}) {
  if(force) localStorage.setItem(this.cacheId + "_ExpirationTime", 0)
  this.startUpdates()
}

DashInfo.prototype._saveInLocalStorage = function(key,value) {
  try {
    localStorage.setItem(key, value) 
  } catch {
    // Clean expired information
    this._cleanStore() 
    try {
      // Try again, to see if removing expired entries was enougth 
      localStorage.setItem(key, value) 
    } catch (e) {
      // If it was not, them clear all cache and try again
      localStorage.clear()
      try {
        localStorage.setItem(key, value) 
        console.warn("CoB localStorage full: cleaned")
      } catch (e) {
        // If, even with all storage available, we have an error log it 
        console.error("CoB localStorage not enought")
      } 
    }
  }
}

DashInfo.prototype._cleanStore = function() {
  // Clean all stored for more then 5 days
  let now = Date.now()
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    let key = localStorage.key(i);
    if (key && key.endsWith("_ExpirationTime")) {
      let expirationTime = localStorage.getItem(key);
      if (expirationTime < now) {
        let keyName = key.substr(0,key.indexOf("_ExpirationTime"));
        localStorage.removeItem(keyName + "_ExpirationTime");
        localStorage.removeItem(keyName + "_Results");
      }
    }
  }
}

export default DashInfo