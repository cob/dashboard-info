import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldValues = ({def, fieldName, query, size=10, sort="", ascending="asc" }) => {
  if(fieldName.endsWith(".raw")) {
    fieldName = fieldName.slice(0,-4);
  }

  let agg = {
    "x": {
      "terms": {
        "field": fieldName + ".raw",
        "size": size
      }
    }
  }

  return rmDefinitionAggregation(def, agg , query, 0, size, sort="", ascending="asc")
    .then(response => {
      let keysCount = response.aggregations['sterms#x'].buckets
      let hits = {}
      for(let k of keysCount) {
        hits[k.key] = { 
          count: k.doc_count,
          hits: response.hits.hits.filter( i => i._source[fieldName] && i._source[fieldName][0] == k.key ).map( h => h._source)
        }
      }
      //Note that the above filter excludes hits that don't have the fieldName value, which we don't consider on the keyCount map below

      return ({
        value: keysCount.map(e => e.key),
        href: encodeURI( response.resultsUrl ),
        hits : hits
      })
    })
    .catch ( e => { throw(e) })
}

export default fieldValues