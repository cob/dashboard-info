import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldSum = ({defId, fieldName, query, tz}) => {
  let agg = {
    "x": {
      "sum": {
        "field": fieldName
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query, 0, 0, "", "", tz)
  .then(response => 
    ({
      value: response.aggregations["sum#x"].value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldSum