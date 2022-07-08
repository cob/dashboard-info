import {umLoggedin} from "@cob/rest-api-wrapper"
import Storage from "dom-storage"
import sleep from "src/utils/sleep.js"

//Add suport for localstorage in node
if (typeof window === 'undefined' && typeof global.localStorage === 'undefined') {
    global.localStorage = new Storage('./.localstorage.json', {strict: false, ws: '  '});
    global.sessionStorage = new Storage(null, {strict: true});
}

console.log("TESTE")

const Loading = "loading"
const Cache = "cache"
const Updating = "updating"
const ReadyNew = "ready"
const ReadyOld = "cache"
const Error = "error"

class DashInfo {

    constructor({validity = 0, changeCB, onStateChange}, getterFunction, getterArgs) {
        this.validity = validity
        this.changeCB = changeCB
        this.onStateChange = onStateChange
        this.getterArgs = getterArgs || {}
        this.getterFunction = getterFunction

        this._results = {value: undefined, href: undefined, state: Loading}
        this.state = Loading

        this._username = null
        this._getNewResults = async () => this.getterFunction(this.getterArgs)
        this._stop = false

        // Quando num browser, parar de fazer Updates quando se sai da página actual
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this.stopUpdates())
        }

        // Get the initial state of the storage values
        // eslint-disable-next-line no-unexpected-multiline
        (async () => {
            await this._loadCachedValues()
            this.startUpdates()
        })();
    }

    get id() {
        return [this.getterFunction.name, ...Object.values(this.getterArgs)].join("_")
    }

    get value() {
        return this._results.value
    }

    get href() {
        return this._results.href
    }

    set state(newState) {
        if (newState !== this.state) {
            this._currentState = newState
            this._results.state = newState
            if (this.onStateChange) this.onStateChange(newState)
        }
    }

    get state() {
        return this._currentState
    }

    get cacheId() {
        return this._username + '-' + this.id
    }

    changeArgs(newArgs) {
        for (const key in newArgs) this.getterArgs[key] = newArgs[key]
        this._getNewResults = () => this.getterFunction(this.getterArgs)
        this.update({force: false})
    }

    update({force = true} = {}) {
        if (force) localStorage.setItem(this.cacheId + "_ExpirationTime", "0")
        this.startUpdates()
    }

    startUpdates() {
        if (this._stop) this._stop = false
        // noinspection JSIgnoredPromiseFromCall
        this._loadValues()
    }

    stopUpdates() {
        this._stop = true
    }


    // ********************************************
    // Private functions
    // ********************************************
    async _loadCachedValues() {
        const loggedInResponse = await umLoggedin()
        this._username = loggedInResponse.username

        const storedResults = localStorage.getItem(this.cacheId + "_Results");
        if (storedResults != null && storedResults !== 'undefined') {
            // Start by loading the existing values from the local storage
            this._results = JSON.parse(storedResults)
            this.state = Cache
            if (this.changeCB) this.changeCB(this._results)
        }
    }

    async _loadValues() {
        if (this._stop) return

        // Some other DashInfo may have updated the local storage for the same query. We need to pull the information
        await this._loadCachedValues()

        const now = Date.now();
        const expirationTime = parseInt(localStorage.getItem(this.cacheId + "_ExpirationTime") || 0, 10);
        if (now > expirationTime || expirationTime - now > this.validity * 1000 || !this._results) {

            // Do this immediately to avoid to minimum collision situations
            this._saveInLocalStorage(this.cacheId + "_ExpirationTime", now + this.validity * 1000);
            if (this.state !== Loading) this.state = Updating

            try {
                const newResults = await this._getNewResults()
                if (JSON.stringify(this._results) !== JSON.stringify(newResults)) {
                    this.state = ReadyNew
                    this._results = newResults
                    if (this.changeCB) this.changeCB(newResults)

                } else {
                    //this._currentState = ReadyOld
                    this.state = ReadyOld
                }

                // Launch a new cycle if validity != 0 and this.stop is not true (either by explicitly being set or if unload occurred)
                if (this.validity && !this._stop) {
                    await sleep(this.validity * 1000)
                    // noinspection ES6MissingAwait
                    this._loadValues()
                }

            } catch (e) {
                this.state = Error

            } finally {
                if (typeof this._results !== 'undefined' && typeof this._results !== 'function') {
                    this._saveInLocalStorage(this.cacheId + "_Results", JSON.stringify(this._results))
                }
            }

        } else {
            // Value from cache but launch a new cycle also - if validity and this.stop is not true (either by explicitly being set or if unload occurred)
            if (this.validity && !this._stop) {
                await sleep(this.validity * 1000)
                // noinspection ES6MissingAwait
                this._loadValues()
            }
        }

    }

    _saveInLocalStorage(key, value) {
        try {
            localStorage.setItem(key, value)
            return
        } catch (e) {
            // Clean expired information
            this._cleanStore()
        }

        // try again but now with some storage clean
        try {
            // Try again, to see if removing expired entries was enougth
            localStorage.setItem(key, value)
            return
        } catch (e) {
            // If it was not set, then clear all cache and try again
            localStorage.clear()
            console.warn("CoB localStorage full: cleaned")
        }

        try {
            localStorage.setItem(key, value)
        } catch (e) {
            // If, even with all storage available, we have an error log it
            console.error("CoB localStorage not enought. Giving up")
        }
    }

    _cleanStore() {
        // Clean all stored for more then 5 days
        let now = Date.now()
        for (let i = 0, len = localStorage.length; i < len; ++i) {
            let key = localStorage.key(i);
            if (key && key.endsWith("_ExpirationTime")) {
                let expirationTime = localStorage.getItem(key);
                if (expirationTime < now) {
                    let keyName = key.substring(0, key.indexOf("_ExpirationTime"));
                    localStorage.removeItem(keyName + "_ExpirationTime");
                    localStorage.removeItem(keyName + "_Results");
                }
            }
        }
    }
}

export default DashInfo