# Custom Req e Res

Para simplificar o desenvolvimento da API, podemos estender o objeto request com propriedades e métodos adicionais. Com isso o `handler` já recebe todos os dados prontos para uso.

- **`query`**
  - Contém os search params da URL já convertidos em um objeto para fácil acesso.

- **`body`**
  - Corpo da requisição já processado e convertido para o formato adequado.

- **`ip`**
  - Endereço IP do cliente extraído automaticamente da conexão.

- **`cookies`**
  - Cookies enviados na requisição já parseados em um objeto.

---

**custom-request**:

```ts
async function customRequest(req) {
  // URL Parsing
  const url = new URL(req.url || "/", "http://localhost");
  req.pathname = url.pathname;
  req.query = url.searchParams;

  // Body Parsing
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");
  if (req.headers["content-type"] === "application/json") {
    req.body = JSON.parse(body);
  } else {
    req.body = body;
  }
  return req;
}
```

```ts
const server = createServer(async (request, response) => {
  const req = await customRequest(request);
});
```

---

# Custom Response

Podemos estender o objeto response para incluir métodos utilitários que facilitem o envio da resposta.

- **`status(statusCode)`**
  - Define o código de status e retorna o próprio response (encadeável).

- **`json(valor)`**
  - Define Content-Type para application/json; faz o Stringify e envia a resposta.

**custom-response**:

```ts
function customResponse(res) {
  res.status = (statusCode) => {
    res.statusCode = statusCode;
    return res;
  };
  res.json = (value) => {
    try {
      const body = JSON.stringify(value);
      res.setHeader("Content-Type", "application/json");
      res.end(body);
    } catch {
      res.status(500).end("error");
    }
  };
  return res;
}
```

```ts
const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);
});
```
