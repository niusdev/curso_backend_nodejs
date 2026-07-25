# Database

## Singleton

[O que é?](https://refactoring.guru/pt-br/design-patterns/singleton)

<details>
<summary>Por que é considerado um problema? </summary>
O padrão Singleton costuma ser visto como um problema ou anti-padrão porque ele cria estado global escondido, dificulta testes unitários e viola o princípio da responsabilidade única

[Ver mais 🔍](https://www.youtube.com/watch?v=yimeXZ1twWs)

</details>

<br>
Se inicializamos o banco de dados em um arquivo separado e apenas o importamos nos demais módulos, na prática criamos um singleton.

<br>
Singletons se comportam como variáveis globais: introduzem estado compartilhado entre módulos, geram efeitos colaterais na importação e dependem da ordem de importação.

<br>

- **Ordem Importa**  
  O singleton é importado em diferentes arquivos, qual é o arquivo que realmente inicia ele? Depende da primeira importação que ocorrer.

- **Efeito Colateral**  
  A criação do singleton acontece no momento da primeira importação, um efeito colateral da mesma, e isso nem sempre é desejável.

## Ex.:

```ts
//database.ts
import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync("./lms.sqlite");
```

```ts
//index.ts
import { db } from "./database.ts";
db.exec("CREATE TABLE...");
```

```ts
//products.ts
import { db } from "./database.ts";
db.exec("SELECT * FROM products;");
```

---

Para evitar o uso do Singleton, vamos inserir o database como uma dependência do Core. Assim, toda a aplicação usa a mesma conexão do DB exposta pelo Core.

```ts
//database.md
import { DatabaseSync } from "node:sqlite";

export class Database extends DatabaseSync {
  constructor(path: string) {
    super(path);
    this.exec(`
      PRAGMA foreign_keys = 1;
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = NORMAL;

      PRAGMA cache_size = 2000;
      PRAGMA busy_timeout = 5000;
      PRAGMA temp_store = MEMORY;
    `);
  }
}
```

```ts
//core.ts
export class Core {
  db: Database;
  constructor() {
    // ...
    this.db = new Database("./lms.sqlite");
    // ...
  }
}
```

```ts
//index.ts
core.router.get("/products/:slug", (req, res) => {
  const { slug } = req.params;
  const product = core.db
    .query(
      `SELECT * FROM 
      "products" WHERE "slug" = ?`,
    )
    .get(slug);
  res.status(200).json(product);
});
```

---

## Prepare

A função `prepare` compila o SQL para bytecode interno do SQLite. Essa função possui um custo de processamento. Podemos diminuir esse custo ao salvar o resultado na memória.

> **É importante prepararmos os SQL's apenas com dados estáticos.**

- `queries`  
  Objeto cache com as queries já preparadas, indexado pelo SQL original.

- `query`  
  Função que insere no cache a query preparada (se ainda não existir) e retorna a instância preparada da memória quando já existir.

```ts
//database.ts
import { DatabaseSync, StatementSync } from "node:sqlite";

export class Database extends DatabaseSync {
  queries: Record<string, StatementSync>;
  constructor(path: string) {
    super(path);
    this.exec(`
      PRAGMA foreign_keys = 1;
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = NORMAL;

      PRAGMA cache_size = 2000;
      PRAGMA busy_timeout = 5000;
      PRAGMA temp_store = MEMORY;
    `);
    this.queries = {};
  }
  query(sql: string) {
    if (!this.queries[sql]) {
      this.queries[sql] = this.prepare(sql);
    }
    return this.queries[sql];
  }
}
```

## Diagrama Prepare

![alt text](image-1.png)
