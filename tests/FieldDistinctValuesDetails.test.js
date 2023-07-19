/** @jest-environment node */
import fieldValues from "../src/FieldValues.js"

test('for "Arab world" there are 4 indicators', async () => {
    let results = await fieldValues({def:2, fieldName:"indicator_code", query:'Arab  World', size: 20} )
    expect(results.hits).toEqual({ 
        "AG.SRF.TOTL.K2": { "count": 5, "hits": [{ "definitionName": "Countries Series", "indicator_code": ["AG.SRF.TOTL.K2"], "year": ["1531177200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Surface area (sq. km)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 1605, "country_name": ["Arab World"], "id": 1605, "value": ["11273300.9922791"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["AG.SRF.TOTL.K2"], "year": ["1404601200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Surface area (sq. km)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 5813, "country_name": ["Arab World"], "id": 5813, "value": ["11273293.9922333"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["AG.SRF.TOTL.K2"], "year": ["1499554800000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Surface area (sq. km)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 2657, "country_name": ["Arab World"], "id": 2657, "value": ["11273300.9922791"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["AG.SRF.TOTL.K2"], "year": ["1436223600000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Surface area (sq. km)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 4761, "country_name": ["Arab World"], "id": 4761, "value": ["11273300.9922791"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["AG.SRF.TOTL.K2"], "year": ["1467932400000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Surface area (sq. km)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 3709, "country_name": ["Arab World"], "id": 3709, "value": ["11273300.9922791"], "definitionId": 2 }] }, 
        
        "EG.USE.COMM.CL.ZS": { "count": 5, "hits": [{ "definitionName": "Countries Series", "indicator_code": ["EG.USE.COMM.CL.ZS"], "year": ["1531177200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Alternative and nuclear energy (% of total energy use)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 1608, "country_name": ["Arab World"], "id": 1608, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["EG.USE.COMM.CL.ZS"], "year": ["1467932400000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Alternative and nuclear energy (% of total energy use)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 3712, "country_name": ["Arab World"], "id": 3712, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["EG.USE.COMM.CL.ZS"], "year": ["1436223600000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Alternative and nuclear energy (% of total energy use)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 4764, "country_name": ["Arab World"], "id": 4764, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["EG.USE.COMM.CL.ZS"], "year": ["1404601200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Alternative and nuclear energy (% of total energy use)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 5816, "country_name": ["Arab World"], "id": 5816, "value": ["0.41441321"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["EG.USE.COMM.CL.ZS"], "year": ["1499554800000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Alternative and nuclear energy (% of total energy use)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 2660, "country_name": ["Arab World"], "id": 2660, "definitionId": 2 }] }, 
        
        "NY.GDP.MKTP.CN.AD": { "count": 5, "hits": [{ "definitionName": "Countries Series", "indicator_code": ["NY.GDP.MKTP.CN.AD"], "year": ["1531177200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["GDP: linked series (current LCU)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 1607, "country_name": ["Arab World"], "id": 1607, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["NY.GDP.MKTP.CN.AD"], "year": ["1467932400000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["GDP: linked series (current LCU)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 3711, "country_name": ["Arab World"], "id": 3711, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["NY.GDP.MKTP.CN.AD"], "year": ["1404601200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["GDP: linked series (current LCU)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 5815, "country_name": ["Arab World"], "id": 5815, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["NY.GDP.MKTP.CN.AD"], "year": ["1499554800000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["GDP: linked series (current LCU)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 2659, "country_name": ["Arab World"], "id": 2659, "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["NY.GDP.MKTP.CN.AD"], "year": ["1436223600000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["GDP: linked series (current LCU)"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 4763, "country_name": ["Arab World"], "id": 4763, "definitionId": 2 }] }, 
        
        "SP.POP.TOTL": { "count": 5, "hits": [{ "definitionName": "Countries Series", "indicator_code": ["SP.POP.TOTL"], "year": ["1499554800000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Population, total"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 2658, "country_name": ["Arab World"], "id": 2658, "value": ["411898965"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["SP.POP.TOTL"], "year": ["1531177200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Population, total"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 1606, "country_name": ["Arab World"], "id": 1606, "value": ["419790588"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["SP.POP.TOTL"], "year": ["1467932400000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Population, total"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 3710, "country_name": ["Arab World"], "id": 3710, "value": ["404024433"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["SP.POP.TOTL"], "year": ["1436223600000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Population, total"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 4762, "country_name": ["Arab World"], "id": 4762, "value": ["396028278"], "definitionId": 2 }, { "definitionName": "Countries Series", "indicator_code": ["SP.POP.TOTL"], "year": ["1404601200000"], "_links": { "size": "0" }, "country_code_reference": ["ARB"], "indicator_name": ["Population, total"], "_definitionInfo": { "name": "Countries Series", "id": 2, "instanceLabel": [], "instanceDescription": [{ "name": "Country Code", "description": "$ref(Countries,*)  $instanceDescription", "id": 32 }, { "name": "Country Name", "description": "$auto.ref(Country Code).field(Short Name) $instanceDescription", "id": 33 }, { "name": "Year", "description": "$date $instanceDescription", "id": 34 }, { "name": "Indicator Code", "description": "$instanceDescription", "id": 36 }, { "name": "Value", "description": "$number $groupEdit $instanceDescription", "id": 37 }] }, "version": 0, "country_code": ["551"], "instanceId": 5814, "country_name": ["Arab World"], "id": 5814, "value": ["387907748"], "definitionId": 2 }] } })

})