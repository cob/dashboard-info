import { rmDefinitionSearch } from "@cob/rest-api-wrapper"

const instancesList = ({definitionName, query, size, start}) => 
  rmDefinitionSearch(definitionName,query, start, size)
  .then(response => 
    ({
      value: response.hits.hits.map(e => e._source),
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

export default instancesList