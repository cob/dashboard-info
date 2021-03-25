import { rmDefinitionAdvSearch } from "@cob/rest-api-wrapper"

const fieldSum = (defId, fieldName, query) => {
  let agg = {
    "x": {
      "sum": {
        "field": fieldName
      }
    }
  }

  return rmDefinitionAdvSearch(defId, agg , query)
  .then(response => 
    ({
      value: response.aggregations["sum#x"].value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldSum