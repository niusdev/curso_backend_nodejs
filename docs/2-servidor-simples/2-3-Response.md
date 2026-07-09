# Response

# setHeader

Defini os cabeçalhos da resposta. Permite o controle de `CORS`, informando quais métodos, origens e cabeçalhos são permitidos.

- `Access-Control-Allow-Methods`
  - Define os métodos permidos pelo servidor. `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `HEAD` e etc.

- `Set-Cookie`
  - Envia cookies com a resposta.

- `Access-Control-Allow-Origin`
  - Define as URLs que podem fazer requisições ao seu servidor. O uso de "`*`" permite qualquer origem.

- `Cache-Control`
  - Define os atributos do cache.

```ts
// CORS
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader(
  "Access-Control-Allow-Methods",
  "GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS",
);
res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

// Cache
res.setHeader("Cache-Control", "max-age=300, must-revalidate");

// Cookie
res.setHeader(
  "Set-Cookie",
  "token=123; HttpOnly; SameSite=Strict; Max-Age=3600; Path=/; Secure;",
);
```

> **CORS (Compartilhamento de Recursos entre Origens)**: é um mecanismo de segurança dos navegadores que impede que um site faça requisições para um domínio diferente daquele onde foi hospedado, a menos que o servidor de destino permita.

# Content-Type

Define o tipo de conteúdo enviado na resposta.

- `application/json`
  - Para envio de `JSON`, importante **enviar um JSON válido em formato de string** com o `JSON.stringify()`.

```ts
// Content-Type -> JSON
res.setHeader("Content-Type", "application/json");
return res.end(JSON.stringify({ user: "origamid" }));
```

- `text/html`
  - Para envio de **textos e html**, **necessário definir o charset para mostrar corretamenta caracteres especiais como acentos**.

```ts
// Content-Type -> HTML
res.setHeader("Content-Type", "text/html; charset=utf-8");
const curso = "Node.js";
return res.end(`<html>
  <head>
    <title>Curso de ${curso}$</title>
  </head>
  <body>
    <h1>Curso de ${curso}$</h1>
  </body>
</html>`);
```

# statusCode

Define o código do status da resposta.

> https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status

- **`200`**: OK.
- **`201`**: Created.
- **`301`**: Moved Permanently.
- **`400`**: Bad Request.
- **`404`**: Not Found.
- **`500`**: Internal Server Error.

> ex.: `res.statusCode = 200`;
