import {dmEquipmentSearch} from "@cob/rest-api-wrapper"

const equipmentCount = ({query}) =>
    dmEquipmentSearch(query, 0, 0)
        .then(response =>
            ({
                value: response.hits.total.value,
                href: response.resultsUrl
            })
        )
        .catch(e => { throw(e) })

export default equipmentCount