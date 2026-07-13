const response = await fetch('http://localhost:3000/produto?categoria=moveis&slug=mesa', {
    method: 'GET',
    // headers: {
    //     "Content-Type": "application/json"
    // },
    // body: JSON.stringify({
    //     "nome": "Notebook",
    //     "slug": "notebook",
    //     "categoria": "eletronicos",
    //     "preco": 4000
    // })
});

const data = await response.json();
console.log(data);