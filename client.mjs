const response = await fetch('http://localhost:3000/produtos/notebook', {
    method: 'GET',
    // body: JSON.stringify({produto: "notebook", cor: "azul"})
});

const body = await response.text();
console.log(body);