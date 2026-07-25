# Middleware

Middleware são funções executadas antes do Handler, que também lidam com o Request/Response.

- **global**  
  São executados para todas as rotas, como o Body Parser

- **local**  
  São executados apenas na rota em que foram definidos.

## Ex.:

```ts
type Middleware = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

export const logger: Middleware = (req, res) => {
  console.log(`[${Date.now()}] ${req.method} ${req.pathname}`);
};
```

## Uso:

```
core.router.get(
  "/",
  (req, res) => {
    res.status(200).end("hello");
  },
  [logger]
);
```
