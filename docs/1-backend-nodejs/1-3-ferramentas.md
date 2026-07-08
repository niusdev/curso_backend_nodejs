# Ferramentas

- Node.js 24+
- VS Code

### Instalação e execução:

```shell
# instale os tipos do node
npm i -D @types/node
```

```shell
# executa o arquivo
node server.mjs

# executa o arquivo automaticamente em caso de mudanças
node --watch server.mjs

# remove avisos do node
node --no-warnings --watch server.mjs
```
--- 

**Esconder Arquivos VS Code:**

```json
{
  "files.exclude": {
    ".vscode": true,
    "package.json": true,
    "package-lock.json": true,
    "node_modules": true
  }
}
```
