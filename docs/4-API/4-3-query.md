> NUNCA FAÇA UMA QUERY SEM LIMITES (05:30)

# Query

Separar todas as consultas ao banco de dados em arquivos específicos, pode melhorar a organização e facilitar o desenvolvimento.

```ts
//abstract.ts
export abstract class Query {
  db: Core["db"];
  constructor(db: Core["db"]) {
    this.db = db;
  }
}
```

```ts
// /api/lms/query.ts
export class LmsQuery extends Query {
  insertCourse({ slug, title, description, lessons, hours }: CourseCreate) {
    return this.db
      .query(
        /*sql*/ `
        INSERT OR IGNORE INTO "courses"
        ("slug", "title", "description", "lessons", "hours")
        VALUES (?,?,?,?,?)`,
      )
      .run(slug, title, description, lessons, hours);
  }
}
```
