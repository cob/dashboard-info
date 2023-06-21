const newCountCalls = function (offset = 0, name = "countCalls") {
    // Esta função é só um exemplo que pode ser usado durante o desenvolvimento.
    // Para efeitos de teste devolve o número de calls a esta função da instância.
    var _callCount = 1

    const countCalls = () => new Promise( resolve => resolve( {
        value: offset + _callCount,
        href: "https://" + (offset + _callCount++),
    }) ) 

    Object.defineProperty(countCalls, 'name', {value: name, writable: false});

    return countCalls 
}

export default newCountCalls