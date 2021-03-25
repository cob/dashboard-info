import { rmDefinitionAdvSearch } from "@cob/rest-api-wrapper"

const fieldDistinctValues = (defId, fieldName, query, size) => {
  let agg = {
    "x": {
      "terms": {
        "field": fieldName,
        "size": size
      }
    }
  }

  return rmDefinitionAdvSearch(defId, agg , query)
  .then(response => 
    ({
      value: response.aggregations['sterms#x'].buckets.map(e => e.key),
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldDistinctValues