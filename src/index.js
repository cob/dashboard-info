import { setServer, auth, umLoggedin } from "@cob/rest-api-wrapper"
import DashInfo from "./DashInfo.js"

import defCount from "./DefinitionCount.js"
import instList from "./InstancesList.js"
import domCount from "./DomainCount.js"
import fSum     from "./FieldSum.js"
import fAverage from "./FieldAverage.js"
import fValues  from "./FieldValues.js"


const definitionCount = (definitionName,   query="*",          options={}) => new DashInfo(options, defCount, {query:query, definitionName:definitionName })
const domainCount     = (domainId,         query="*",          options={}) => new DashInfo(options, domCount, {query:query, domainId:domainId })
const fieldSum        = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fSum,     {query:query, defId:defId, fieldName:fieldName })
const fieldAverage    = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fAverage, {query:query, defId:defId, fieldName:fieldName })
const instancesList   = (definitionName,   query="*", size=10, options={}) => new DashInfo(options, instList, {query:query, definitionName:definitionName,  size:size })
const fieldValues     = (defId, fieldName, query="*", size=10, options={}) => new DashInfo(options, fValues,  {query:query, defId:defId, fieldName:fieldName, size:size })

export { DashInfo, definitionCount, instancesList, domainCount, fieldSum, fieldValues, setServer, auth, umLoggedin }