const sleep = function(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default sleep