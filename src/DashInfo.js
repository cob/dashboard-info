import { umLoggedin } from "@cob/rest-api-wrapper"
import Storage from '../node_modules/dom-storage/lib/index.js'

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
}

const DashInfo = function({validity=60, changeCB}, getterFunction, getterArgs) {
  this.validity = validity
  this.changeCB = changeCB
  this.getterArgs = getterArgs || {}
  this.getterFunction = getterFunction
  this._getNewResults = () => this.getterFunction(this.getterArgs)
  this.results = {value:undefined, href:undefined}
  Object.defineProperties(this, {
    "value":  { "get": () => this.results.value },
    "href":   { "get": () => this.results.href },
    "id":     { "get": () => [getterFunction.name,...Object.values(this.getterArgs)].join("_") },
    "cacheId":{ "get": () => this.username + '-' + this.id }
  })
  
  // Quando num browser, parar de fazer Updates quando se sai da página actual
  if(typeof window !== 'undefined') window.addEventListener('unload', () => this.stopUpdates() )

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
      if(this.changeCB) this.changeCB(this.results)
    }
    
    //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
    let now = Date.now();
    let expirationTime = localStorage.getItem(this.cacheId + "_ExpirationTime") || 0; //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão
    if ( now > expirationTime || expirationTime - now > this.validity*1000 || storedResults == null ) {
      localStorage.setItem(this.cacheId + "_ExpirationTime", now + this.validity*1000); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão
      
      return this._getNewResults()
        .then( results => {
          if(JSON.stringify(this.results) != JSON.stringify(results)) {
            this.results = results
            if(this.changeCB) this.changeCB(results)
          } 
          // Launch a new cycle (only if no error occurred)
          if(!this.stop) setTimeout( () => this.startUpdates({start:false}), this.validity * 1000)
        })
        .catch( e => Promise.reject(e) )
        .finally( () => {
          if (typeof this.results !== 'undefined' && typeof this.results !== 'function') {
            try {
              localStorage.setItem(this.cacheId + "_Results", JSON.stringify(this.results))
            } catch (e) { // In case of error: warn, clean & retry
              console.warn(e)
              this._cleanStore() 
              localStorage.setItem(this.cacheId + "_Results", JSON.stringify(this.results)) 
            }
          }
      })
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