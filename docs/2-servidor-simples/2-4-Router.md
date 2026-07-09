# Router

Um `router` (roteador) é responsável por organizar as rotas e encontrá-las.

- **Organizar**:
  - As rotas podem ser armazenadas em objetos separados por método HTTP (GET, POST, DELETE etc.), facilitando a busca.

- **Encontrar**:
  - Quando chega uma requisição, o router busca a rota correspondente com base no `req.method` e na `req.url`. E retorna o `handler`.

---

**Router**:

```ts
class Router {
  routes = {
    GET: {},
    POST: {},
  };
  get(route, handler) {
    this.routes["GET"][route] = handler;
  }
  post(route, handler) {
    this.routes["POST"][route] = handler;
  }
  find(method, route) {
    return this.routes[method]?.[route] || null;
  }
}
```

**routes**:

```ts
router.get("/", (req, res) => {
  res.end("Home");
});

router.get("/produto/notebook", (req, res) => {
  res.end("Produtos - Notebook");
});

router.post("/produto", (req, res) => {
  res.end("Notebook Post");
});
```

**server**:

```ts
const server = createServer((req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");

  const url = new URL(req.url || "/", "http://localhost");
  const handler = router.find(req.method, url.pathname);
  if (handler) {
    res.statusCode = 200;
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end("404");
  }
});
```

# Handler

O `handler` é a **função responsável por tratar a requisição de uma rota específica**. Ele **recebe** o `request` (req) e o `response` (res) como parâmetros, permitindo acessar dados enviados pelo cliente e enviar a resposta.

```ts
function handleProdutos(req, res) {
  const produtos = getProdutos();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(produtos));
}

router.get("/produtos", handleProdutos);
```
