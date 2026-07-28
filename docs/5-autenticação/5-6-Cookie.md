## Cookie

Além do valor do cookie, **podemos definir propriedades para torná-lo mais seguro**.

[Propriedades para Cookies.](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie)

## Usaremos:

- `__Secure-sid=?;`
  Prefixo no nome do cookie impõe o uso de Secure.

- `Path=/;`
  Funciona em qualquer rota do site.

- `Max-Age=3600;`
  Total em segundos que o cookie deve durar. 0 apaga ele.

- `HttpOnly;`
  Previne o acesso direto pelo cliente em document.cookie.

- `Secure;`
  Garante que o cookie só seja enviado via HTTPS.

- `SameSite=Lax`
  É enviado em solicitações originadas pelo mesmo site que definiu ele e em outras situações.

```ts
const ttlSec = 60 * 60 * 24 * 15;

const sid = (await randomBytesAsync(32)).toString("base64url");

const cookie = `__Secure-sid=${sid}; Path=/; Max-Age=${ttlSec}; HttpOnly; Secure; SameSite=Lax`;
```

# Parse Cookies

Os cookies vêm em uma única string para o servidor.**Cada cookie é separado por ;** e **apenas o par chave=, valor é recebido**.

```ts
function parseCookies(cookieHeader: string | undefined) {
  const cookies: Record<string, string | undefined> = {};
  if (!cookieHeader) return cookies;

  const cookiePairs = cookieHeader.split(";");
  for (const seg of cookiePairs) {
    const pair = seg.trim();
    if (!pair) continue;
    const i = pair.indexOf("=");
    const key = i === -1 ? pair : pair.slice(0, i).trim();
    if (!key) continue;
    const value = i === -1 ? "" : pair.slice(i + 1).trim();
    cookies[key] = value;
  }
  return cookies;
}

const cookies = " sid= 2134212; pref = theme=dark&video=2; full = 1; user=";

const cookiesParsed = parseCookies(cookies);
// { sid: '2134212', pref: 'theme=dark&video=2', full: '1', user: '' }
```
