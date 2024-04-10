import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

const fieldAverage = ({defId, fieldName, query, tz}) => {
  let agg = {
    "x": {
      "avg": {
        "field": fieldName
      }
    }
  }

  return rmDefinitionAggregation(defId, agg , query, 0, 0, "", "", tz)
  .then(response => 
    ({
      value: response.aggregations["avg#x"].value,
      href: encodeURI( response.resultsUrl )
    })
  )
  .catch ( e => { throw(e) })
}

export default fieldAverage