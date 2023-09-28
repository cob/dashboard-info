import axios from "axios"

const httpGet = ({url, config}) => axios.get(url, config)
    .then(resp => ({value: resp.data}))
    .catch(e => {throw (e)})

const httpPost = ({url, data, config}) => axios.post(url, data, config)
    .then(resp => ({value: resp.data}))
    .catch(e => {throw (e)})

export {httpGet, httpPost}
