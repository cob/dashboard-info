import { umLoggedin } from "@cob/rest-api-wrapper"
import Storage from '../node_modules/dom-storage/lib/index.js'

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
}

const DashInfo = function({validity=60, changeCB=()=>{}}, getterFunction, ...getterArgs) {
  this.validity = validity
  this.changeCB = changeCB
  this.getterArgs = getterArgs
  this.results = {value:undefined, href:undefined}
  this._getNewResults = () => getterFunction(...this.getterArgs)
  
  Object.defineProperties(this, {
    "value":  { "get": () => this.results.value },
    "href":   { "get": () => this.results.href },
    "id":     { "get": () => [getterFunction.name,...this.getterArgs].join("_") },
    "cacheId":{ "get": () => this.username + '-' + this.id }
  })
  
  this._cleanStore()  // preemptivamente limpa todos os valores na cache expirados quando arranca
  umLoggedin().then( result => {
    this.username = result.username;
    this.startUpdates()
  })
  .catch( e => { throw e })

  //Se num browser, parar de fazer update quando se sai da página actual
  if(typeof window !== 'undefined') window.addEventListener('unload', () => this.stopUpdates() )

}

DashInfo.prototype._updateResults = function () {
  umLoggedin().then( result => {
    if(result.username != this.username) {
      this.username = result.username;
      this.forceRefresh()
    }
  })
  .catch( e => { throw e })

  let now = Date.now();
  // console.log("Time:" +now) // FOR TEST DEBUGING ONLY

  // Obtem valores da localStore
  var storedResults = localStorage.getItem(this.cacheId + "_Results");
  if (storedResults != null && storedResults !== 'undefined') {
    this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
  }
  
  //Se a cache está fora de validade OU o tempo que falta para expirar é maior que a validade OU ainda não tem um valor, então obtem novo valor
  let expirationTime = localStorage.getItem(this.cacheId + "_ExpirationTime") || 0; //Fazer isto imediatamente ANTES do teste à expiração para minimizar tempo de colisão
  if ( now > expirationTime || expirationTime - now > this.validity*1000 || storedResults == null ) {
    localStorage.setItem(this.cacheId + "_ExpirationTime", now + this.validity*1000); //Fazer isto imediatamente DEPOIS do teste à expiração para minimizar tempo de colisão
    
    this._getNewResults().then( results => {
      if(JSON.stringify(this.results) != JSON.stringify(results)) {
        this.results = results
        this.changeCB(results)
      } 
    }).catch( e => {})
    .finally( () => {
      if (typeof this.results !== 'undefined' && typeof this.results !== 'function') {
        // TODO: test available space or clean
        localStorage.setItem(this.cacheId + "_Results", JSON.stringify(this.results))
      }
    })
  }
}

DashInfo.prototype.startUpdates = function() {
  // //Se não estiver visível retorna sem actualiza valor 
  // //TODO: Levar em consideração casos em que quero os cálculos mesmo quando não está visível
  // //this.$el.isConnected não está a funcionar correctamente no Edge. 
  // if (!this.$el /*|| !this.$el.isConnected*/) { return }

  this._updateResults();
  this.cycle = setTimeout(() => { this && this.startUpdates() }, this.validity * 1000)
}

DashInfo.prototype.stopUpdates = function() {
  clearTimeout(this.cycle)
}

DashInfo.prototype.forceRefresh = function() {
  localStorage.setItem(this.cacheId + "_ExpirationTime", 0);
  this._updateResults();
}

DashInfo.prototype._cleanStore = function() {
  // Clean all stored for more then 5 days
  // TODO: test cleanStore
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    let key = localStorage.key(i);
    let now = Date.now()
    if (key && key.endsWith("_ExpirationTime")) {
      let expirationTime = localStorage.getItem(key);
      if (expirationTime < now - 5 * 24 * 60 * 60 * 1000) {
        let keyName = key.substr(0,key.indexOf("_ExpirationTime"));
        localStorage.removeItem(key);
        localStorage.removeItem(keyName + "_Results");
        localStorage.removeItem(keyName + "_Updater");
      }
    }
  }
}

export default DashInfo