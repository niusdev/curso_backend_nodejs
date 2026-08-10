# Content Length

O corpo da requisição não tem limite definido por padrão. Podemos verificar o limite e recusar as requisições que ultrapassarem o mesmo.

- `['content-length']`  
  Indica o tamanho do corpo da requisição. Valor não confiável.

- `Buffer.length`  
  Tamanho real do corpo da requisição.

```ts
// user valores baixos se for lidar apenas com texto
const MAX_BYTES = 5_000_000; // 5 MN

const contentLength = Number(req.headers["content-length"]);
if (!Number.isInteger(contentLength)) {
  throw new RouteError(400, "content-length inválido");
}
if (contentLength > MAX_BYTES) {
  throw new RouteError(413, "corpo grande");
}
```

# Headers

O Node.js já previne o envio de headers e URLs maiores que 16 KiB.

```ts
// HPE_HEADER_OVERFLOW
// server para os headers e para a url
this.server.on("clientError", (err, socket) => {
  console.log(err);
  socket.destroy();
});
```

---

**OBS.:**

> - nunca confie nos headers
> - 5000000 (equivale a 5MB)
> - 16KiB são o limite máximo do node para tamanhos de headers e URL's
