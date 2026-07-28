# randomBytes

Função nativa do Node que gera uma quantidade específica de bytes aleatórios.

- `randomBytes(32)`
  Buffer com 32 bytes (256 bits) aleatórios.

- `toString('base64url')`
  Transforma o buffer de bytes em uma string.

- `promisify`
  Utilidade do Node que transforma funções assíncronas baseadas em callback em funções nativas que retornam Promises.

```ts
import { randomBytes } from "node:crypto";
import { promisify } from "node:util";

const randomBytesAsync = promisify(randomBytes);

const buffer = await randomBytesAsync(32);

const sid = buffer.toString("base64url");

console.log(sid);
```

### toString()

A função toString transforma um buffer de bytes em uma string.

- `hex`
  Retorna uma string em hexadecimal. Valores de 0 até f.

- `base64`
  Retorna uma string em base64. A–Z a–z 0–9 + / e padding =

- `base64url`
  Retorna uma string em base64 segura para usar em URLs e cookies. Troca + por -, / por \_ e normalmente sem =.

**Exemplo:**

```ts
import { randomBytes } from "node:crypto";
import { promisify } from "node:util";

const randomBytesAsync = promisify(randomBytes);

const buffer = await randomBytesAsync(32);
const hex = buffer.toString("hex");
const base64 = buffer.toString("base64");
const base64url = buffer.toString("base64url");

console.log(buffer);
console.log(hex);
console.log(base64);
console.log(base64url);
```
