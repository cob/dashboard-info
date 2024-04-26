import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldWeightedAverage = ({defId, fieldName, weightFieldName, query, tz}) => {
  let agg = {
    "x": {
      "weighted_avg": {
        "value": {
          "field": fieldName
        },
        "weight": {
          "field": weightFieldName
        }
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query, 0, 0, "", "", tz)
  .then(response => 
    ({
      value: response.aggregations["weighted_avg#x"].value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldWeightedAverage