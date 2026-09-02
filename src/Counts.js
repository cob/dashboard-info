import { rmDefinitionSearch, rmDomainSearch, dmEquipmentSearch } from "@cob/rest-api-wrapper"

// Common shape of every count answer
const countResult = response => ({
  value: response.hits.total.value,
  href: response.resultsUrl
})

const definitionCount = ({definitionName, query, tz}) =>
  rmDefinitionSearch(definitionName, query, 0, 0, "", "", tz).then(countResult)

const domainCount = ({domainId, query}) =>
  rmDomainSearch(domainId, query).then(countResult)

const equipmentCount = ({query}) =>
  dmEquipmentSearch(query, 0, 0).then(countResult)

// Explicit ids for DashInfo cache keys: survive function-name minification
definitionCount.id = "definitionCount"
domainCount.id = "domainCount"
equipmentCount.id = "equipmentCount"

export { definitionCount, domainCount, equipmentCount }
