import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const sortDirection = (direction, value) => value * (direction=="asc"?1:-1);

const isNumeric = (value) => !isNaN(value) && !isNaN(parseFloat(value));

const sortFunction = (sortField, direction, a, b) => {
  const xA = a[sortField] !== undefined ? (typeof(a[sortField]) == "object" ? a[sortField][0] : a[sortField] ) : null;
  const xB = b[sortField] !== undefined ? (typeof(b[sortField]) == "object" ? b[sortField][0] : b[sortField] ) : null;

  // Handle missing values
  if (xA === null && xB === null) return 0; // Both missing
  if (xA === null) return sortDirection(direction,1);  // a missing
  if (xB === null) return sortDirection(direction,-1);  // b missing

  // Check if both are numbers
  const isNumA = typeof xA === "number" || isNumeric(xA);
  const isNumB = typeof xB === "number" || isNumeric(xA);

  if (isNumA && isNumB) {
      // Compare numerically
      return sortDirection(direction, xA*1 - xB*1);
  }

  // Convert to strings for comparison when not both are numbers
  const strA = String(xA);
  const strB = String(xB);

  // Compare as strings
  return sortDirection(direction, strA > strB ? 1 : strA == strB ? 0 : -1 );
}

const fieldValues = ({def, fieldName, query, size=10, sort="", ascending="asc", tz}) => {
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

  return rmDefinitionAggregation(def, agg , query, 0, size, sort, ascending, tz)
    .then(response => {
      let distingValues = response.aggregations['sterms#x'].buckets
      let hits = {}
            
      for(let k of distingValues) {
        let hitsToSort = response.hits.hits.filter( i => i._source[fieldName] && i._source[fieldName][0] == k.key ).map( h => h._source)
        if(sort) {
          hitsToSort = hitsToSort.sort((a,b) => sortFunction(sort,ascending,a,b));
          //Add the top (i=0) value of sort values to K (just to be used for the sort of keys bellow)
          k["__orderFieldValue__"] = hitsToSort && hitsToSort[0] && hitsToSort[0][sort] && hitsToSort[0][sort][0]
        }
        hits[k.key] = { 
          count: k.doc_count,
          hits: hitsToSort
        }
      }
      if(sort) {
        distingValues = distingValues.sort((a,b) => sortFunction("__orderFieldValue__",ascending, a,b))
      }
      return ({
        value: distingValues.map(e => e.key),
        href: response.resultsUrl ,
        hits : hits
      })
    })
}

export default fieldValues