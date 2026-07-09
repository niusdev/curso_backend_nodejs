const response = await fetch('http://localhost:3000/produto?cor=vermelho', {
    method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify({ username: 'andre', password: '123456' }),
});

console.log(response);

const body = await response.text();
console.log(body);
