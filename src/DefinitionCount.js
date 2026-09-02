import { rmDefinitionSearch } from "@cob/rest-api-wrapper"

const definitionCount = ({definitionName, query, tz}) => 
  rmDefinitionSearch(definitionName,query, 0, 0, "", "", tz)
  .then(response => 
    ({
      value: response.hits.total.value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

// Explicit id for DashInfo cache keys: survives function-name minification
definitionCount.id = "definitionCount"

export default definitionCount