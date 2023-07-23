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

  return rmDefinitionAggregation(def, agg , query, 0, size, sort=sort, ascending="asc")
    .then(response => {
      let keysCount = response.aggregations['sterms#x'].buckets
      let hits = {}
      for(let k of keysCount) {
        let hitsToSort = response.hits.hits.filter( i => i._source[fieldName] && i._source[fieldName][0] == k.key ).map( h => h._source)
        if(sort) {
          hitsToSort = hitsToSort.sort((a,b)=>a[sort] && b[sort] && a[sort][0]*1 - b[sort][0]*1)
          k.order = hitsToSort && hitsToSort[0][sort] && hitsToSort && hitsToSort[0][sort][0]*1
        }
        hits[k.key] = { 
          count: k.doc_count,
          hits: hitsToSort
        }
      }
      //Note that the above filter excludes hits that don't have the fieldName value, which we don't consider on the keyCount map below

      if(sort) {
        keysCount = keysCount.sort((a,b)=>a.order - b.order)
      }
      return ({
        value: keysCount.map(e => e.key),
        href: encodeURI( response.resultsUrl ),
        hits : hits
      })
    })
    .catch ( e => { throw(e) })
}

export default fieldValues