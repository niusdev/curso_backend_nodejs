# Formatar

Qualquer alteração feita no input é uma formatação. Formatamos o input por questões de usabilidade e segurança.

- **usabilidade**
  Garantir dados consistentes na base de dados. Ex: todo email em caixa baixa.

- **segurança**
  Evitar tentativas de ataques com valores especiais.

Ex.:

```ts
function email(x: string) {
  return x.toLowerCase().trim();
}

// remove o que não for digito
function cpf(x: string) {
  return x.replace(/\D+/g, "");
}
```

## Normalizar

A normalização é um tipo de formatação focada em **garantir a consistência dos dados**.

```ts
const a = `é`.normalize("NFC");
const b = `e\u0301`.normalize("NFC");

const nome = " André".trim();
```

## Escapar

Escapar é substituir caracteres especiais para que sejam tratados como dados e não como código. Ex: substituir > pela sua entidade de caractere equivalente `&gt;`.

- **segurança**  
  É um tipo de **formatação focada em segurança**. Geralmente **_aplicada no momento do uso e não durante o recebimento do input_**, pois seria muito trabalhoso e passível de erros tentar fazer o 'escape' de todos os caracteres especiais que podem ser utilizados para executar código na aplicação.

- **manual/automático**  
  _Escapar nem sempre é necessário, o ideal é utilizar inputs de forma segura_. Ex: no **SQL apenas via** `binds/prepared statements` e no **HTML** com `innerText/setAttribute`.

Ex.:

```ts
function escapeHtml(x: string) {
  return x
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
```

> O 'Escapar' é geralmente feito pela ferramenta.

## Sanitizar

É um tipo de formatação **focada na limpeza de valores gerais do input**. _Pode conter normalização, remoção de caracteres especiais e mais_.

```ts
// zero-width space são caracteres invisíveis, que contam no length
// https://stackoverflow.com/questions/11305797/remove-zero-width-space-characters-from-a-javascript-string
function removeZw(x: string) {
  return x.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "");
}

function sanitize(x: string) {
  return removeZw(x).normalize("NFC").trim();
}
```

> CURIOSIDADE:  
> **zero-width space** podem ser usados em meio a textos de um site como 'digital', para atribuir autoria ao dono do texto.

> ATENÇÃO: Jamais devemos sanitizar passwords, no máx. fazemos o `normalize`, tanto no momento que o password vem para ser cadastrado no BD, quanto no momento que vem para ser comparado (login).
