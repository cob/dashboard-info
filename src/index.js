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
import * as HttpRequest from "./HttpRequest.js"


const dmEquipmentCount     = (query="*",                                    options={}) => new DashInfo(options, dmEquipCount, {query:query})
const definitionCount      = (definitionName,   query="*",                  options={}) => new DashInfo(options, defCount, {query:query, definitionName:definitionName, tz: options.tz  })
const domainCount          = (domainId,         query="*",                  options={}) => new DashInfo(options, domCount, {query:query, domainId:domainId })
const fieldSum             = (defId, fieldName, query="*",                  options={}) => new DashInfo(options, fSum,     {query:query, defId:defId, fieldName:fieldName, tz: options.tz })
const fieldAverage         = (defId, fieldName, query="*",                  options={}) => new DashInfo(options, fAverage, {query:query, defId:defId, fieldName:fieldName, tz: options.tz })
const fieldValues          = (def,   fieldName, query="*", size=10,         options={}) => new DashInfo(options, fValues,  {query:query, def:def, fieldName:fieldName, size:size, sort:options.sort, ascending:options.ascending, tz: options.tz })
const fieldWeightedAverage = (defId, fieldName, weightFieldName, query="*", options={}) => new DashInfo(options, fWeightedAverage, {query:query, defId:defId, fieldName:fieldName, weightFieldName:weightFieldName, tz: options.tz  })
const instancesList        = (definitionName,   query="*", size=10, start=0, sort="", ascending="", options={}) => new DashInfo(options, instList, {query:query, definitionName:definitionName, size:size, start:start, sort:sort, ascending:ascending })
const httpGet              = (url, axiosConfig, options={}) => new DashInfo(options, HttpRequest.httpGet, {url, axiosConfig})
const httpPost             = (url, data, axiosConfig, options={}) => new DashInfo(options, HttpRequest.httpPost, {url, data, axiosConfig})

export { DashInfo, definitionCount, instancesList, domainCount, fieldSum, fieldAverage, fieldWeightedAverage, fieldValues, setServer, auth, umLoggedin, dmEquipmentCount, httpGet, httpPost }