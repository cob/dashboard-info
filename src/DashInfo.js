import { getUsername } from "@cob/rest-api-wrapper"
import Storage from '../node_modules/dom-storage/lib/index.js'

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
}

const DashInfo = function({validity=60, notifyChangeCB=()=>{}}, getterFunction, ...getterArgs) {
  this.validity = validity
  this.notifyChangeCB = notifyChangeCB
  this.getterArgs = getterArgs
  this.results = {value:undefined, href:undefined}
  this._getNewResults = () => getterFunction(...this.getterArgs)
  
  Object.defineProperties(this, {
    "value": { "get": () => this.results.value },
    "href":  { "get": () => this.results.href },
    "id":  { "get": () => [getterFunction.name,...this.getterArgs].join("_") }
  })
  
  this._cleanStore()  // preemptivamente limpa todos os valores na cache expirados quando arranca
  this.startUpdates()

  //Se num browser, parar de fazer update quando se sai da página actual
  if(typeof window !== 'undefined') window.addEventListener('unload', () => this.stopUpdates() )

}

DashInfo.prototype._updateResults = function () {
  let username = getUsername() // TODO: really get (and wait) for the user.
  if(!username) return // we still don't have a username. Wait for next cycle
  
  let now = Date.now();
  // console.log("Time:" +now) // FOR TEST DEBUGING ONLY
  let cacheId = username + '-' + this.id

  // Obtem valores da localStore
  var storedResults = localStorage.getItem(cacheId + "_Results");
  if (storedResults != null && storedResults !== 'undefined') {
    this.results = JSON.parse(storedResults) // Se existir começa por usar a cache
  }
  let expirationTime = localStorage.getItem(cacheId + "_ExpirationTime") || 0; //Fazer isto imediatamente antes do teste à expiração para minimizar tempo de colisão
  
  //Se a cache está fora de validade ou o tempo que falta para expirar é maior que a validade, então obtem novo valor
  if ( now > expirationTime || expirationTime - now > this.validity*1000 || storedResults == null ) {
    // TODO: test available space or clean
    localStorage.setItem(cacheId + "_ExpirationTime", now + this.validity*1000); //Fazer isto primeiro para minimizar tempo de colisão

    this._getNewResults().then( results => {
      if(JSON.stringify(this.results) != JSON.stringify(results)) {
        this.results = results
        this.notifyChangeCB(results)
      } 
    }).catch( e => {})
    .finally( () => {
      if (typeof this.results !== 'undefined' && typeof this.results !== 'function') {
        localStorage.setItem(cacheId + "_Results", JSON.stringify(this.results))
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
  let cacheId = getUsername() + this.id
  localStorage.setItem(cacheId + "_ExpirationTime", 0);
  this._updateResults();
  this._cleanStore()  // aproveita para preemptivamente voltar a limpar todos os valores na cache expirados
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