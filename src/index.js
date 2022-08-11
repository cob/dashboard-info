import { setServer, auth, umLoggedin } from "@cob/rest-api-wrapper"
import DashInfo from "./DashInfo.js"

import defCount from "./DefinitionCount.js"
import instList from "./InstancesList.js"
import domCount from "./DomainCount.js"
import fSum     from "./FieldSum.js"
import fAverage from "./FieldAverage.js"
import fWeightedAverage from "./FieldWeightedAverage.js"
import fValues  from "./FieldValues.js"
import dmEquipCount  from "./DmEquipmentCount.js"


const definitionCount = (definitionName,   query="*",          options={}) => new DashInfo(options, defCount, {query:query, definitionName:definitionName })
const domainCount     = (domainId,         query="*",          options={}) => new DashInfo(options, domCount, {query:query, domainId:domainId })
const fieldSum        = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fSum,     {query:query, defId:defId, fieldName:fieldName })
const fieldAverage    = (defId, fieldName, query="*",          options={}) => new DashInfo(options, fAverage, {query:query, defId:defId, fieldName:fieldName })
const fieldWeightedAverage = (defId, fieldName, weightFieldName, query="*", options={}) => new DashInfo(options, fWeightedAverage(), {query:query, defId:defId, fieldName:fieldName, weightFieldName:weightFieldName })
const instancesList   = function(definitionName,   query="*", size=10, start=0, sort="", ascending="", options={}){
    //note: cannot be an arrow function because Arrow functions don't have their own bindings to 'arguments'
    if (arguments.length < 7) {
        console.warn("Number of arguments is less than the expected 7. Maybe the call was written for an older version of dashinfo.\n"
                     + "Make sure you have no holes in args list (pass undefined in those args if needed).")
    }

    return new DashInfo(options, instList, {query:query, definitionName:definitionName, size:size, start:start, sort:sort, ascending:ascending })
}
const fieldValues     = (defId, fieldName, query="*", size=10, options={}) => new DashInfo(options, fValues,  {query:query, defId:defId, fieldName:fieldName, size:size })
const dmEquipmentCount = (query="*", options={}) => new DashInfo(options, dmEquipCount, {query:query})

export { DashInfo, definitionCount, instancesList, domainCount, fieldSum, fieldAverage, fieldWeightedAverage, fieldValues, setServer, auth, umLoggedin, dmEquipmentCount }