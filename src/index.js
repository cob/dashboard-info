import { auth, setServer } from "@cob/rest-api-wrapper"

import DashInfo from "./DashInfo.js"

import defCount from "./DefinitionCount.js"
import instList from "./InstancesList.js"
import domCount from "./DomainCount.js"
import fSum     from "./FieldSum.js"
import fValues  from "./FieldValues.js"


const definitionCount = (definitionName,   query="*",          options={}) => new DashInfo(options, defCount, definitionName, query)
const domainCount     = (domainId,         query="*",          options={}) => new DashInfo(options, domCount, domainId, query)
const fieldSum        = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fSum, defId, fieldName, query)
const instancesList   = (definitionName,   query="*", size=10, options={}) => new DashInfo(options, instList, definitionName, query, size)
const fieldValues     = (defId, fieldName, query="*", size=10, options={}) => new DashInfo(options, fValues, defId, fieldName, query, size)


export { definitionCount, instancesList, domainCount, fieldSum, fieldValues, auth, setServer }