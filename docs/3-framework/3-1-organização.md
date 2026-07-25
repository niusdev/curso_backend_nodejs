# Organização - Framework

Iremos organizar o código em dois diretórios principais.

- **/core**
  - Arquivos essenciais para o funcionamento do Framework.

- **/api**
  - Rotas e funcionalidades do aplicativo. Mudam de aplicativo para aplicativo.

```
- index.ts

/core
  - core.ts
  - router.ts
  - database.ts
  /http
    - custom-request.ts
    - custom-response.ts
  /middleware
  /utils

/api
  /courses
    - index.ts
  /auth
    - index.ts
```

- **Consistência:**
  - A única regra de organização que sempre funciona é a consistência.

- **Restrições**
  - Consistência gera limites. Limites simplificam escolhas.

- **Padrões**
  - Consistência cria padrões. Nada ensina melhor do que estruturas repetidas.
