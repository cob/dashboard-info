const sleep = function(timeout) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve(), timeout)
    });
}

export default sleep