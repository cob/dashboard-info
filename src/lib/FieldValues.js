import {rmDefinitionAggregation} from "@cob/rest-api-wrapper"

const fieldValues = ({defId, fieldName, query, size = 10}) => {
    let agg = {
        "x": {
            "terms": {
                "field": fieldName,
                "size": size
            }
        }
    }

    return rmDefinitionAggregation(defId, agg, query, 0, size)
        .then(response =>
            ({
                value: response.aggregations['sterms#x'].buckets.map(e => e.key),
                href: response.resultsUrl
            })
        )
        .catch(e => { throw(e) })
}

export default fieldValues