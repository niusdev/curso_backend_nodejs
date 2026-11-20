# Servir Arquivos

Servimos arquivos estáticos através de um servidor como `NGINX` ou `depósitos do tipo S3`.

Porém, existem casos onde precisamos servir através do Node, para estes utilizamos **_streams_** para garantir o envio sem preencher a memória da aplicação com o arquivo completo.

## NGINX

É um servidor web utilizado para servir conteúdo estático e servir o Node como **proxy reverso**.

## Stream

Vamos enviar imagens, PDFs, ZIPs e HTML via `stream`, garantindo uso de memória constante e suporte a arquivos grandes.

```ts
// readfile
core.router.get("/files/:name", async (req, res) => {
  const file = await readFile(`./files/${req.params.name}`);
  res.status(200).end(file);
});

// stream
core.router.get("/files/:name", async (req, res) => {
  const file = createReadStream(`./files/${req.params.name}`);
  res.status(200);
  await pipeline(file, res);
});
```

# Problema: Path Traversal

Devemos ter cuidado ao lidar com a leitura de arquivos, onde o caminho vem de fontes não confiáveis (cliente).

()[https://owasp.org/www-community/attacks/Path_Traversal]

- **../package.json**  
  Devemos formatar o caminho passado pelo usuário, para impedir que o mesmo leia diretórios/arquivos sensíveis.

- **Caracteres Especiais**  
  Para facilitar, podemos impedir a leitura de qualquer nome de arquivo que contenha caracteres como /, % e outros que podem ser problemáticos.

```ts
// consegue ler
const filePath = "../package.json";
const file = await readFile(`./files/${filePath}`);
```

```ts
// não consegue ler
const filePath = "../package.json";
if (!/^(?!\.)[A-Za-z0-9._-]+$/.test(filePath)) throw new Error("invalido");
const file = await readFile(`./files/${filePath}`);
```

# Content Type

O tipo de arquivo enviado deve ser definido no header `Content-Type`.

- **Extensão**  
  Arquivos possuem diferentes extensões como .jpg, .jpeg e outras. Essas são diferentes do MIME type.

- **MIME type**  
  Indica o tipo de mídia do arquivo, como image/jpeg

```ts
import path from "node:path";

const mimeType: Record<string, string> = {
  ".ico": "image/x-icon",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".zip": "application/zip",
};

core.router.get("/files/:name", async (req, res) => {
  const { name } = req.params;
  const ext = path.extname(name).toLowerCase();
  const file = createReadStream(`./files/${name}`);

  res.status(200);
  // "application/octet-stream" representa um binário desconhecido
  res.setHeader("Content-Type", mimeType[ext] || "application/octet-stream");
  // previne que o browser mude o MIME Type
  res.setHeader("X-Content-Type-Options", "nosniff");
  await pipeline(file, res);
});
```

## Headers

Existem outros cabeçalhos úteis que devem ser enviados com o arquivo.

- **Content-Length**  
  Indica o tamanho em bytes do conteúdo.

- **Last-Modified**  
  Última vez que o conteúdo foi modificado.

- **ETag**  
  Identificador único que serve para definir o cache.

```ts
const st = await stat(filePath);
res.setHeader("Content-Length", st.size);
res.setHeader("Last-Modified", st.mtime.toUTCString());
```

## Etag

É um header que deve conter um identificador único do recurso enviado. Pode servir para controle do cache. O cache do browser é feito por URL, o que torna a ETag necessária para validar um arquivo que foi modificado, sem modificar o nome.

- **W/id**  
  Indica que é um validador fraco. Após deve vir um identificador único, geralmente calculado a partir do tamanho/data de modificação do arquivo.

- **If-None-Match**  
  Header enviado na requisição com ETags referentes à URL acessada. Serve para verificarmos se o recurso existe em cache.

```ts
const st = await stat(filePath);
const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;

export function checkETag(match: string | undefined, etag: string) {
  if (!match) return false;
  const tags = match.split(",").map((s) => s.trim());
  return tags.includes(etag);
}

res.setHeader("ETag", etag);
res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

if (checkETag(req.headers["if-none-match"], etag)) {
  res.statusCode = 304;
  res.end();
  return;
}
```
