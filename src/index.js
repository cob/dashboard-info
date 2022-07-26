import {auth, setServer, umLoggedin} from "@cob/rest-api-wrapper"
import DashInfo from "src/DashInfo.js"

import defCount from "src/lib/DefinitionCount.js"
import instList from "src/lib/InstancesList.js"
import domCount from "src/lib/DomainCount.js"
import fSum from "src/lib/FieldSum.js"
import fAverage from "src/lib/FieldAverage.js"
import fWeightedAverage from "src/lib/FieldWeightedAverage.js"
import fValues from "src/lib/FieldValues.js"
import dmEquipCount from "src/lib/DmEquipmentCount.js"


const definitionCount = (definitionName, query = "*", options = {}) =>
    new DashInfo(options, defCount, {query: query, definitionName: definitionName})

const domainCount = (domainId, query = "*", options = {}) =>
    new DashInfo(options, domCount, {query: query, domainId: domainId})

const fieldSum = (defId, fieldName, query = "*", options = {}) =>
    new DashInfo(options, fSum, {query: query, defId: defId, fieldName: fieldName})

const fieldAverage = (defId, fieldName, query = "*", options = {}) =>
    new DashInfo(options, fAverage, {query: query, defId: defId, fieldName: fieldName})

const fieldWeightedAverage = (defId, fieldName, weightFieldName, query = "*", options = {}) =>
    new DashInfo(options, fWeightedAverage(), {query: query, defId: defId, fieldName: fieldName, weightFieldName: weightFieldName})

const instancesList = (definitionName, query = "*", size = 10, start = 0, options = {}) =>
    new DashInfo(options, instList, {query: query, definitionName: definitionName, size: size, start: start})

const fieldValues = (defId, fieldName, query = "*", size = 10, options = {}) =>
    new DashInfo(options, fValues, {query: query, defId: defId, fieldName: fieldName, size: size})

const dmEquipmentCount = (query = "*", options = {}) => new DashInfo(options, dmEquipCount, {query: query})

export {
    DashInfo,
    definitionCount,
    instancesList,
    domainCount,
    fieldSum,
    fieldAverage,
    fieldWeightedAverage,
    fieldValues,
    setServer,
    auth,
    umLoggedin,
    dmEquipmentCount
}