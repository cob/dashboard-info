import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldAverage = ({defId, fieldName, query}) => {
  let agg = {
    "x": {
      "avg": {
        "field": fieldName
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query)
  .then(response => 
    ({
      value: response.aggregations["avg#x"].value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldAverage