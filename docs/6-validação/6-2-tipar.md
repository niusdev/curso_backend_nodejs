# Tipar

Validar o tipo de dado garante que o nosso código não quebre ao tentar executar funções em tipos diferentes do esperado.

- `string`
  Validar se é uma string e se ela possui algum caractere.

- `number`
  Validar se é um número válido e não `Infinity`/`NaN`.


```ts
function string(x: unknown) {
  if (typeof x !== "string" || x.trim().length === 0) throw new Error("string esperada");
  return x;
}

function number(x: unknown) {
  if (typeof x !== "number" || !Number.isFinite(x)) throw new Error("número esperado");
  return x;
}
```
> OBS.: Foi implementada a função para verificar valores booleanos, além disso, na implementação do retorno de erro das funções temos `undefined`.