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
