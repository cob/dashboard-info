import { rmDomainSearch } from "@cob/rest-api-wrapper"

const domainCount = (domainId, query) => 
  rmDomainSearch(domainId, query)
  .then(response => 
    ({
      value: response.hits.total.value,
      href: response.resultsUrl
    })
  )
  .catch ( e => { throw(e) })

export default domainCount