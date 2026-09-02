import axios from "axios"

const httpGet = ({url, axiosConfig}) => axios.get(url, axiosConfig)
    .then(resp => ({value: resp.data}))

const httpPost = ({url, data, axiosConfig}) => axios.post(url, data, axiosConfig)
    .then(resp => ({value: resp.data}))

// Explicit id for DashInfo cache keys: survives function-name minification
httpGet.id = "httpGet"
httpPost.id = "httpPost"

export {httpGet, httpPost}
