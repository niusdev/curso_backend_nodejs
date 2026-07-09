# createServer

Função para a criação de servidores com Node.js

- `(req, res) => {}`
  - Callback que é ativado toda vez que é feita uma requisição ao servidor. Possui acesso a requisição (req) e resposta (res).

- `listen(port)`
  - Inicia o servidor e fica aguardando requisições na porta passada.

```ts
import { createServer } from "node:http";

const server = createServer((request, response) => {
  response.end("Hello World!");
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
```

# Response

A `response` é um objeto do **tipo `ServerResponse` que possui propriedades e métodos para interagir com a resposta que será dada pelo servidor** .

- `statusCode`
  - Define o status da resposta como `200` (Ok), `404` (Not Found), `301` (Moved Permanently), `201` (Created) e outros.

- `setHeader(key, value)`
  - Define um cabeçalho para a resposta, recebe a chave e depois o valor.

```ts
const server = createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  response.end("Olá Mundo.");
});
```

# Request

Temos no `request` um objeto do **tipo `IncomingMessage` com propriedades e métodos para obter dados da requisição**. Com essas informações podemos identificar a rota passada pelo usuário e servir as informações corretas.

- `method`
  - Identifica o método utilizado no request, como GET, POST, DELETE, PUT e outros.

- `url`
  - Pega a URL utilizada durante o request.

```ts
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/plain; charset=utf-8");
  if (request.method === "GET" && request.url === "/") {
    response.statusCode = 200;
    response.end("Home.");
  } else if (request.method === "POST" && request.url === "/produto") {
    response.statusCode = 201;
    response.end("Produto criado.");
  } else {
    response.statusCode = 404;
    response.end("Não encontrada.");
  }
});
```
