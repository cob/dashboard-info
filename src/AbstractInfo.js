const { getServer, getUsername } = require("@cob/rest-api-wrapper")

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    var Storage = require('dom-storage');
    global.localStorage = new Storage('./db.json', { strict: false, ws: '  ' });
    global.sessionStorage = new Storage(null, { strict: true });
}

AbstractInfo = function(cacheId, validity, notifyChangeCB) {
  this.cacheId = cacheId
  this.validity = validity
  this.notifyChangeCB = notifyChangeCB
  this.server = getServer()
  this.firstValueCommunicated = false;
  this.firstUrlCommunicated = false;
  this.resultsUrl = ""
  this._cleanStore()  // preemptivamente limpa todos os valores na cache expirados quando arranca
  this.startUpdates()
}

AbstractInfo.prototype._updateValueCycle = function () {
  this._updateValue();
  this.cycle = setTimeout(() => { this._updateValueCycle() }, this.validity * 1000)
}

AbstractInfo.prototype._updateValue = function () {
  let username = getUsername()
  if(!username) return // we still don't have a username. Wait for next cycle
  
  let now = Date.now();
  let myCacheId = username + '-' + this.cacheId

  // //Se não estiver visível retorna sem actualiza valor 
  // //TODO: Levar em consideração casos em que quero os cálculos mesmo quando não está visível
  // //this.$el.isConnected não está a funcionar correctamente no Edge. 
  // if (!this.$el /*|| !this.$el.isConnected*/) { return }

  // Obtem valores da localStore
  var storedValue = localStorage.getItem(myCacheId + "_Value");
  if (storedValue != null && storedValue !== 'undefined') {
    this.value = JSON.parse(storedValue); // Se existir começa por usar a cache
    if(!this.firstValueCommunicated) {
      this.firstValueCommunicated = true
      this.notifyChangeCB(this.value, this.resultsUrl)
    }
  }
  let expirationTime = localStorage.getItem(myCacheId + "_ExpirationTime") || 0; //Fazer isto imediatamente antes do teste à expiração para minimizar tempo de colisão
  
  //Se a cache está fora de validade ou o tempo que falta para expirar é maior que a validade, então obtem novo valor
  if ( now > expirationTime || expirationTime - now > this.validity*1000 || storedValue == null ) {
    localStorage.setItem(myCacheId + "_ExpirationTime", now + this.validity*1000); //Fazer isto primeiro para minimizar tempo de colisão

    this._getNewValue().then(value => {
      if(JSON.stringify(this.value) != JSON.stringify(value) || this.resultsUrl && !this.firstUrlCommunicated ) {
        this.value = value;
        this.firstValueCommunicated = true // Para o caso de esta ser a primeira chamada
        this.firstUrlCommunicated = true // Para o caso de esta ser a primeira chamada
        this.notifyChangeCB(value, this.resultsUrl)
      } 
    }).catch(e => {
      // this.errors = e; //Debug info only
    }).finally( () => {
      if (typeof this.value !== 'undefined' && typeof this.value !== 'function') {
        localStorage.setItem(myCacheId + "_Value", JSON.stringify(this.value))
      }
    })
  }
}

AbstractInfo.prototype._getNewValue =function () {
  // Isto tem de ser definido por quem herda esta classe.
  // Esta função é só um exemplo que pode ser usado durante o desenvolvimento.
  // Para efeitos de teste devolve o número de calls a esta função da instância.
  if(typeof this._callCount === "undefined") this._callCount = 1
  return new Promise( (resolve) => {
    resolve(this._callCount++)
  })
}

AbstractInfo.prototype._cleanStore = function() {
  // Clean all stored for more then 5 days
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    let key = localStorage.key(i);
    let now = Date.now()
    if (key && key.endsWith("_ExpirationTime")) {
      let expirationTime = localStorage.getItem(key);
      if (expirationTime < now - 5 * 24 * 60 * 60 * 1000) {
        let keyName = key.substr(0,key.indexOf("_ExpirationTime"));
        localStorage.removeItem(key);
        localStorage.removeItem(keyName + "_Value");
        localStorage.removeItem(keyName + "_Updater");
      }
    }
  }
}

AbstractInfo.prototype.getValue =function () {
  return this.value
}

AbstractInfo.prototype.forceRefresh = function() {
  // if there's no this.cacheId it means we're still initiating, no need to update
  if(this.cacheId) { 
    let myCacheId = getUsername() + this.cacheId
    localStorage.setItem(myCacheId + "_ExpirationTime", 0);
    this._updateValue();
  }
  this._cleanStore()  // aproveita para preemptivamente voltar a limpar todos os valores na cache expirados
}

AbstractInfo.prototype.stopUpdates = function() {
  clearTimeout(this.cycle)
}

AbstractInfo.prototype.startUpdates = function() {
  this._updateValueCycle()
}

module.exports = { AbstractInfo };