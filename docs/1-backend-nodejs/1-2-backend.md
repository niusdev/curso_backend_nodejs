# Back End

Conceitos e funções base que serão utilizados.

## Server

Inicia um servidor que aceita conexões na porta definida.

```ts
const app = createServer((request, response) => {
  response.end("Servidor Funcionando");
});

app.listen(3000);
```

## Router

Permite o registro da rota e do handler (função executada quando a rota é acessada).

```ts
function coursesHandler(request, response) {
  response.end("Cursos de Front End");
}
app.get("/cursos", coursesHandler);
```

```ts
app.get("/cursos", (request, response) => {
  response.end("Cursos de Front End");
});
```

## Request e Response

Receber dados da requisição e enviar uma resposta.

```ts
app.post("/criar/curso", (request, response) => {
  const { name, lessons } = request.body;
  db.createCourse(name, lessons);
  response.end("Curso Criado");
});
```

## Middleware

Executar funções antes de executar o handler.

```ts
function auth(req) {
  return db.validateSession(req.cookie);
}

app.get(
  "/cursos",
  (req, res) => {
    res.end("Cursos de Front End");
  },
  [auth],
);
```

## Body Parse

Receber o corpo como uma stream e realizar o parse dele.

```ts
async function bodyParser(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks).toString("utf-8");
  return JSON.parse(body);
}
```

## Banco de Dados

Conectar, ler e escrever em um banco de dados.

```ts
const db = new Database("./db.sqlite");
db.prepare('SELECT * FROM "users" WHERE "id" = ?').get(1);
```

## Sessão

Criar e validar.

```ts
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  createSession(email, password);
  res.end("logged");
});

app.get("/session", (req, res) => {
  validateSession(req.cookies);
  res.end("valid");
});
```

## Password

Gerar e validar uma chave derivada (DK).

```ts
// Pepper + Salt + Password + Scrypt
password.generate("P@s$w0rd");
// 8fd29c8ee66d1ff9d

password.validate("P@s$w0rd", "8fd29c8ee66d1ff9d");
// true
```

## Validar

Validar e formatar dados.

```ts
app.post("/login", (req, res) => {
  const email = validate.email(req.body.email);
  const password = validate.password(req.body.password);
});
```

## Mail

Enviar emails.

```ts
mail.send({
  to: "teste@example.com",
  subject: "Resetar Senha",
  body: `Use o link para resetar a sua senha: ${link}`,
});
```
