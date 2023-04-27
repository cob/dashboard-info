import { rmDefinitionSearch } from "@cob/rest-api-wrapper"

const instancesList = ({definitionName, query, size, start, sort, ascending}) =>
  rmDefinitionSearch(definitionName,query, start, size, sort, ascending)
  .then(response => 
    ({
      value: response.hits.hits.map(e => e._source),
      total: response.hits.total.value,
      href: encodeURI( response.resultsUrl )
    })
  )
  .catch ( e => { throw(e) })

export default instancesList