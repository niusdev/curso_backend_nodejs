# Front End

Existem diferentes formas de enviarmos arquivos através do Front End.

- **multipart/form-data**  
  Formato mais comum, que inclui dados gerais com arquivos no mesmo corpo da requisição. Não é um formato simples de fazer o parse.

- **base64**  
  Transforma o binário em uma string (pode ser enviado em JSON). Este método infla o tamanho do arquivo durante a transferência em 33%.

- **binário**  
  Enviar o arquivo em binário é eficiente e não necessita de nenhum parser complexo.

```html
<form id="upload">
  <input multiple type="file" name="files" />
  <button>Upload</button>
</form>
```

```ts
const upload = document.getElementById("upload");

// "Content-Type": "application/octet-stream" indica que é um binário
// Campos extras no header para enviar outras informações, como o nome.
upload.addEventListener("submit", async (e) => {
  e.preventDefault();
  const input = upload.querySelector('input[type="file"]');
  const files = input?.files;
  if (!files || files.length === 0) return;
  for (const file of files) {
    await fetch("/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "x-filename": file.name,
      },
      body: file,
    });
  }
});
```

# Back End

Vamos utilizar uma stream para escrever o corpo diretamente no arquivo.

- **temporário**  
  Escrevemos primeiro em um arquivo temporário, se der tudo certo, renomeamos ele para o nome final.
  - podemos fazer uma pasta para os temporários e uma para os finais. No momento estamos utilizando só uma pasta para os dois.

- **erro**  
  Em caso de erro, destruímos a stream de escrita e removemos o arquivo temporário.

```ts
// aceita apenas octet-stream
if (req.headers["content-type"] !== "application/octet-stream") {
  throw new RouteError(415, "use octet-stream");
}

// valida o nome do arquivo
const name = v.file(req.headers["x-filename"]);

// caminho temporário
const tmpPath = `${FILES_PATH}/${randomUUID()}.temp`; //ou .part (parte do arquivo)

// caminho final
const writePath = `${FILES_PATH}/${name}`;

// inicia uma stream de escrita, wx falha se existir
const writeStream = createWriteStream(tmpPath, { flags: "wx" });

// escrevemos o corpo da requisição usando pipeline para a stream
try {
  await pipeline(req, writeStream);
} catch (error) {
  writeStream.end();
  throw new RouteError(500, "erro");
} finally {
  await rm(tmpPath, { force: true }).catch(() => {});
}
```

## path.join

Concatena as strings e forma um caminho normalizado, com base nos dados passados.

```ts
path.join("./files/", "/arquivo.txt");

// files/arquivo.txt no mac/linux
// files\arquivo.txt no windows
```

## Limit Bytes

Para limitar o tamanho do arquivo, devemos utilizar um Transform entre a requisição e a escrita do mesmo. Assim, podemos calcular enquanto a stream é escrita.

```ts
const MAX_BYTES = 150 * 1024 * 1024; // 150 MiB

function LimitBytes(max: number) {
  let size = 0;
  return new Transform({
    transform(chunk, _enc, next) {
      size += chunk.length;
      if (size > max) {
        return next(new Error());
      }
      next(null, chunk);
    },
  });
}

await pipeline(req, LimitBytes(MAX_BYTES), writeStream);
```
