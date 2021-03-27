import { rmDefinitionSearch } from "@cob/rest-api-wrapper"

const instancesList = (def, query, size) => 
  rmDefinitionSearch(def,query, 0, size)
  .then(response => 
    ({
      value: response.hits.hits.map(e => e._source),
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

export default instancesList