import DashInfo from "./DashInfo.js"

import defCount from "./DefinitionCount.js"
import inst     from "./Instances.js"
import domCount from "./DomainCount.js"
import fSum     from "./FieldSum.js"
import fDist    from "./FieldDistinctValues.js"


const definitionCount     = (definitionName,   query="*",          options={}) => new DashInfo(options, defCount, definitionName, query)
const domainCount         = (domainId,         query="*",          options={}) => new DashInfo(options, domCount, domainId, query)
const fieldSum            = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fSum, defId, fieldName, query)
const instances           = (definitionName,   query="*", size=10, options={}) => new DashInfo(options, inst, definitionName, query, size)
const fieldDistinctValues = (defId, fieldName, query="*", size=10, options={}) => new DashInfo(options, fDist, defId, fieldName, query, size)


export { definitionCount, instances, domainCount, fieldSum, fieldDistinctValues }