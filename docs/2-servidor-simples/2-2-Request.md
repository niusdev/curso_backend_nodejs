# Request

## Headers

Cabeçalhos da requisição feita ao servidor.

- `content-type`
  - O **tipo de conteúdo recebido**. Se é `application/json`, `text/html`, `multipart/form-data` e outros.

- `authorization`
  - Header onde **geralmente vem o token de sessão/autenticação**.

- `cookie`
  - Cookies enviados pelo cliente.

- `x-forwarded-for`
  - **Endereço IP de origem**. Pode vir também pelo `req.socket.remoteAddress`.

```ts
req.headers["content-type"];
req.headers.authorization;
req.headers.cookie;
```

## URL

Parte da rota da URL vem em `req.url`. **Para obter a URL completa precisamos construí‑la**.

- `new URL(path, host)`
  - Faz o parsing de uma URL e cria um objeto com suas partes.

- `req.url`
  - Contém apenas o **path + query (sem protocolo/host)**, ex.: `/caminho?query=1`

```ts
// http://localhost:3000/produto?cor=azul&tamanho=g
const url = new URL(req.url || "/", "http://localhost");
url.pathname; // /produto
url.searchParams.get("tamanho"); // g
url.searchParams.get("cor"); // azul
```

```shell
// Não confie em req.headers.host
curl -i \
  -H "Host: evil.com" \
  http://127.0.0.1:3000/

```

> Este comando curl simula uma requisição HTTP maliciosa para testar uma vulnerabilidade de segurança conhecida como **Host Header Injection (Injeção de Cabeçalho Host)**.

Aqui está o desmembramento exato do que cada parte faz:

> `curl -i:` Faz uma requisição web e exibe a resposta do servidor junto com os cabeçalhos HTTP (metadados como cookies, tipo de servidor, etc.).  
> `-H "Host: evil.com"`: Altera o cabeçalho "Host" da requisição. Em vez de enviar o endereço real, ele finge que o usuário está tentando acessar o site evil.com.  
> `http://127.0.0.1:3000/:` Envia essa requisição para um servidor que está rodando na sua própria máquina local (127.0.0.1) na porta 3000.  
> **O Objetivo do Teste**  
> Os atacantes usam essa técnica para ver como o servidor local lida com cabeçalhos falsos.  
> Se o servidor aceitar o cabeçalho evil.com sem validar, isso pode levar a problemas sérios:  
> **Envenenamento de Cache (Cache Poisoning):** O servidor salva uma página falsa e a exibe para usuários legítimos.
> **Redirecionamentos Maliciosos:** Links gerados pelo servidor (como redefinição de senha) podem apontar para o site do atacante.  
> **Acesso a Áreas Restritas:** Ignorar travas de segurança baseadas no nome do domínio.  
> Se você está testando sua própria aplicação, verifique se o seu servidor web descarta requisições com cabeçalhos Host desconhecidos.

# for await

Faz um loop por iteráveis assíncronas aguardando cada item.

`for await (const p`
Inicia o loop e define a variável de iteração (p). A cada ciclo, o for await aguarda o valor resolvido do item antes de avançar.

`of [Promises])`
Após of vem um iterável. Seus elementos podem ser `Promises`, valores já resolvidos ou um `AsyncIterator`.

```ts
const parte1 = Promise.resolve("Olá ");
const parte2 = Promise.resolve("Mundo");
const frase = [];

for await (const parte of [parte1, parte2]) {
  frase.push(parte);
}
frase.join("");
```

# Buffer

`Buffer` **é um bloco de bytes em memória**. Para transformar esses bytes, precisamos concatenar o Buffer e decodificar/interpretar para o formato apropriado.

- `Buffer.from`
  - Transforma um dado em um `Buffer`.

- `Buffer.concat`
  - Concatena uma array de buffers.

```ts
const part1 = Buffer.from("olá ");
const part2 = Buffer.from("mundo");

Buffer.concat([part1, part2]).toString("utf-8");
```

# Body

O corpo da requisição chega como um iterável assíncrono (os `chunks`). Para ler:

- `for await...of`
  - Itera e acumula cada `chunk`.

- `callback`
  - Usa eventos: `data` para cada `chunk` e `end` ao final.

```ts
const chunks = [];
for await (const chunk of req) {
  chunks.push(chunk);
}
const body = Buffer.concat(chunks).toString("utf-8");
```

```ts
const chunks = [];
req
  .on("error", (err) => {
    console.error(err);
  })
  .on("data", (chunk) => {
    chunks.push(chunk);
  })
  .on("end", () => {
    const body = Buffer.concat(chunks).toString("utf-8");
  });
```
