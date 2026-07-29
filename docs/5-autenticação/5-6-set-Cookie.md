# Set Cookie

Com `res.setHeader("Set-Cookie", valor)` um único cookie é enviado. Para enviar vários cookies, o header deve ser uma array de strings.

Em frameworks como o Express, existe o método append('Set-Cookie', 'valor') que é genérico e serve para adicionar informações em qualquer Header.

```ts
res.setCookie = (cookie) => {
  const current = res.getHeader("Set-Cookie");

  // nada setado ainda -> começa a lista
  if (current === undefined) {
    res.setHeader("Set-Cookie", [cookie]);
    return;
  }

  // já é uma lista -> faz o push
  if (Array.isArray(current)) {
    current.push(cookie);
    res.setHeader("Set-Cookie", current);
    return;
  }

  // havia um único valor -> vira lista com os dois
  res.setHeader("Set-Cookie", [String(current), cookie]);
};
```
