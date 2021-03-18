# Introdution

Library of functions to get, from a CoB server, typical dashboard information: aggregated, frequently requested and periodically updated information.

Each function takes care of caching, pooling and sincronizing diferent agents for the same info.

## Install

```
 npm i @cob/dashboard-info
````

## Usage

node:
 const { auth, DefinitionCount } = require("@cob/dashboard-info")

Browser
 import { auth, DefinitionCount } from "@cob/dashboard-info"

set server
auth

ask information setting up callback



## Available functions

After initializing `DefinitionCount` and `DomainCount` will call *notifyChangeCB* with the number of records matching the given *query*, and also a link to the results interface. The same callback will be called with an update every time *validity* expires if the result has changed.
    
```javascript
    const { DefinitionCount } = require("@cob/dashboard-info")
    let info = new DefinitionCount(cacheId, def, query, validity, notifyChangeCB)
```


```javascript
    const { DomainCount } = require("@cob/dashboard-info")
    let info = new DomainCount(cacheId, domainId, query, validity, notifyChangeCB)
```

`Instances` on the other hand will call the *notifyChangeCB* with a list of *size* results to the given *query*.

```javascript
    const { Instances } = require("@cob/dashboard-info")
    let info = new Instances(cacheId, def, query, validity, notifyChangeCB)
```

Finally `setServer` and `auth` are only necessary if your application is not integrated in a cob dashboard, like a node script.

It should be used just once in the beginnig of the aplication and it's shared across all other functions.

```javascript
const { auth, setServer, DefinitionCount } = require("@cob/dashboard-info")

function showCB(value, resultsUrl) {
    console.log(value)
}

async function start() {
    setServer("https://yourserver.example.com")
    await auth("username", "password")
    new DefinitionCount("c2","< Definition name >", "< query >", 60, showCB )
}

start()
```


## Examples

 * basic_terminal_dashboard - a minimal terminal aplication that monitors the number of **Test Persons** in learning.cultofbits.com
 * styled_terminal_dashboard - a minimal terminal aplication that monitors the number of **Test Persons** in learning.cultofbits.com

## Library Development
 * Test are supposed to be running through development with `jest --watch -o`
 * If test have conflicting behaviore use `jest --watch -o --runInBand`
 * If a given test is failling try `test.only` to make sure it is not a conflict
 * Test depend on learning.cultofbits.com. Make sure you have connectivity to it.
 * For jest testing purposes the following are necessary:
    * In https://learning.cultofbits.com/recordm/#/definitions/6/q=* 
        * 0 Test Person for "DefinitionCount Test"
        * 0 Test Person for "Instances_Test*"
    * In https://learning.cultofbits.com/recordm/#/definitions/2/q=* 
        * 20 Country Series for "Arab World"
        * 60 Country Series for "United"
 * There should to be only one jest process running
    * if more than two developers are running the DB instances might be overlapped
    * if more than two process running all db.json cache info will be unreliable
 * When tests are not running db*.json should be stable. If they are not it means another jest is running or a test didn't stop adequately. In this case stop all and restart jest.