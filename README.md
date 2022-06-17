# What is @cob/dashboard-info

`@cob/dashboard-info` is a library of functions to get dashboard information from a CoB server.

Dashboard information is typically frequently requested, periodically updated and aggregated information.
These functions are:
 * easy to use
 * minimal footprint with increased code readibility 
 * fast initial responses
 * auto updated information

Each function takes care of caching, pooling and syncronizing diferent agents for the same info.

# How to install

In your project directory run:

```
 npm i @cob/dashboard-info
````

# Available functions

The list of available functions are:
* `definitionCount` - number of instances for a given query on a definition
* `domainCount` - number of instances for a given query on a domain
* `instancesList` - array of instances for a given query on a definition
* `fieldSum` - sum of values of a field for a given query on definition
* `fieldAverage` - average of values of a field for a given query on definition
* `fieldValues` - array of disctinct values of a field for a given query on a definition


Auxiliary functions that allow you to specify the server and the credential. They should be used just once, in the beginnig of the aplication, and it's shared across all functions.
* `setServer` - set the server to use
* `auth` - authenticate a user
> NOTE: you only need to use these functions if your application is not integrated in a cob dashboard, like a node script.



# Examples

A small program to display in a console all changes to the total count of **Persons** every 60s:

```javascript
const { auth, setServer, DefinitionCount } = require("@cob/dashboard-info")

function showCB(value, resultsUrl) {
    console.log(value)
}

async function start() {
    setServer("https://yourserver.example.com")
    await auth("username", "password")
    new DefinitionCount("Persons", showCB, 60, "*")
}

start()
```

 * basic_terminal_dashboard - a minimal terminal aplication that monitors the number of **Test Persons** in learning.cultofbits.com
 * styled_terminal_dashboard - similar to basic_terminal_dashboard but better styled

# Development
For contributions to the project checkout [README.Development.md](./README.Development.md)