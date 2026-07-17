const urlBase = 'http://localhost:3000'

setTimeout(async () => {
    const response = await fetch(urlBase + '/products/notebook');
    console.log(response.ok, response.status);
    const body = await response.json();
    console.log(body);
}, 200);



