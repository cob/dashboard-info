import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldSum = ({defId, fieldName, query}) => {
  let agg = {
    "x": {
      "sum": {
        "field": fieldName
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query)
  .then(response => 
    ({
      value: response.aggregations["sum#x"].value,
      href: encodeURI( response.resultsUrl )
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldSum