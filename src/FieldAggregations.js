import { rmDefinitionAggregation } from "@cob/rest-api-wrapper"

// All single-value field aggregations share the same skeleton: build the ES
// aggregation, run it and extract the value of the single "x" aggregation
const makeFieldAggregation = (id, aggType, buildAggBody) => {
  const aggregation = (args) => {
    const agg = { "x": { [aggType]: buildAggBody(args) } }
    return rmDefinitionAggregation(args.defId, agg, args.query, 0, 0, "", "", args.tz)
      .then(response => ({
        value: response.aggregations[aggType + "#x"].value,
        href: response.resultsUrl
      }))
  }
  // Explicit id for DashInfo cache keys: survives function-name minification
  aggregation.id = id
  return aggregation
}

const fieldSum = makeFieldAggregation("fieldSum", "sum",
  ({fieldName}) => ({ field: fieldName }))

const fieldAverage = makeFieldAggregation("fieldAverage", "avg",
  ({fieldName}) => ({ field: fieldName }))

const fieldWeightedAverage = makeFieldAggregation("fieldWeightedAverage", "weighted_avg",
  ({fieldName, weightFieldName}) => ({ value: { field: fieldName }, weight: { field: weightFieldName } }))

export { fieldSum, fieldAverage, fieldWeightedAverage }
