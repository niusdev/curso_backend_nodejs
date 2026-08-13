# Validar

A validação do input **_ocorre após a verificação do tipo e formatação do input_**. Esta é baseada nas regras de negócio.

- **tamanho**  
  Ex: tamanho entre 2 e 100 caracteres.

- **valor**  
  Ex: valor entre 1 e 1_000_000.

- **`regex`**  
  Ex: email deve ser *str@str.str*

- **regras**  
  Ex: role em _'user' | 'admin'_

- **`required`**  
  Se o input é obrigatório.

- **`optional`**  
  Se o input é opcional.

Ex.: Validar email e cpf.

```ts
// ^ início da string
// [^@]+ 1 ou mais caracteres que não são @
// @ um @
// [^@]+ 1 ou mais caracteres que não são @
// $ fim da string
function email(x: string) {
  return /^[^@]+@[^@]+$/.test(x) ? x : undefined;
}

// 146.104.560-60
function cpf(x: string) {
  // 14610456060
  const cpf = x.replace(/\D+/g, "");

  // testa 11111111111, 22222222222 e +
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return undefined;

  let total1 = 0;
  for (let i = 0; i < 9; i++) {
    // 1 * 10 + 4 * 9 + 6 * 8 ...
    total1 += Number(cpf[i]) * (10 - i);
  }
  // 1590 % 11 = 6 % 10 = 6
  const digito1 = ((total1 * 10) % 11) % 10;
  // 6 !== 6
  if (digito1 !== Number(cpf[9])) return undefined;

  let total2 = 0;
  for (let i = 0; i < 10; i++) {
    // 1 * 11 + 4 * 10 + 6 * 9 ...
    total2 += Number(cpf[i]) * (11 - i);
  }
  // 1980 % 11 = 0 % 10 = 0
  const digito2 = ((total2 * 10) % 11) % 10;
  // 0 !== 0
  if (digito2 !== Number(cpf[10])) return undefined;

  return cpf;
}
```

> Ver (05:00) - fala sobre a validação de email. Não precisa ser tão elaborada. Sobre a validação de cpf, não valida se o valor é existente, mas valida apenas os casos clássicos segundo o cálculo de formação de um cpf (11:00), ou seja, caso seja enviado um cpf que respeite o cálculo mas que possa não existir (pessoa morreu ou não nasceu ainda), o cpf passa nessa validação.

---

### Conclusão:

A **validação de um dado não é final**! Ou seja, não garante que o valor é totalmente verdadeiro, garante apenas que os casos clássicos que são inválidos não passam pela validação que você definiu na sua regra de negócio.

> no curso fizemos as validações através de `regex`. Porém, nos meus projetos usarei bibliotecas para isso. Nossa util validate simula a lib `zod`.
