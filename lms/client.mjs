const urlBase = 'http://localhost:3000'

setTimeout(async () => {
    const response = await fetch(urlBase + '/');
    console.log(response.ok, response.status);
}, 200)



