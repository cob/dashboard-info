import { rmDefinitionSearch } from "@cob/rest-api-wrapper"

const definitionCount = (def, query) => 
  rmDefinitionSearch(def,query, 0, 0)
  .then(response => 
    ({
      value: response.hits.total.value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

export default definitionCount