import { dmEquipmentSearch } from "@cob/rest-api-wrapper"

const equipmentCount = ({query}) =>
  dmEquipmentSearch(query, 0, 0)
  .then(response => 
    ({
      value: response.hits.total.value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

// Explicit id for DashInfo cache keys: survives function-name minification
equipmentCount.id = "equipmentCount"

export default equipmentCount