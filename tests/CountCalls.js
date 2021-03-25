const newCountCalls = function (name) {
    // Esta função é só um exemplo que pode ser usado durante o desenvolvimento.
    // Para efeitos de teste devolve o número de calls a esta função da instância.
    var _callCount = 1

    const countCalls = () => new Promise( resolve => resolve( {
        value: _callCount++,
        href: null,
    }) ) 
    return countCalls 
}

export default newCountCalls