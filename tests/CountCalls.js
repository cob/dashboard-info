const newCountCalls = function (name) {
    // Esta função é só um exemplo que pode ser usado durante o desenvolvimento.
    // Para efeitos de teste devolve o número de calls a esta função da instância.
    var _callCount = 1

    const countCalls = ( {offset = 0}={} ) => new Promise( resolve => resolve( {
        value: offset + _callCount,
        href: "https://" + (offset + _callCount++),
    }) ) 
    return countCalls 
}

export default newCountCalls