import axios from "axios"

const httpGet = ({url, axiosConfig}) => axios.get(url, axiosConfig)
    .then(resp => ({value: resp.data}))
    .catch(e => {throw (e)})

const httpPost = ({url, data, axiosConfig}) => axios.post(url, data, axiosConfig)
    .then(resp => ({value: resp.data}))
    .catch(e => {throw (e)})

export {httpGet, httpPost}
