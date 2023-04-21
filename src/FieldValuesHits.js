import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldValuesHits = ({defId, fieldName, query, size=10}) => {
  if(fieldName.endsWith(".raw")) {
    fieldName = fieldName.slice(0,-3);
  }

  let agg = {
    "x": {
      "terms": {
        "field": fieldName + ".raw",
        "size": size
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query, 0, size)
    .then(response => {
      let keysCount = response.aggregations['sterms#x'].buckets
      let hits = {}
      for(let k of keysCount) {
        hits[k.key] = { 
          count: k.doc_count,
          hits: response.hits.hits.filter( i => i._source[fieldName][0] == k.key).map( h => h._source)
        }
      }
      return ({
        value: keysCount.map(e => e.key),
        href: response.resultsUrl,
        hits : hits
      })
    })
    .catch ( e => { throw(e) })
}

export default fieldValuesHits