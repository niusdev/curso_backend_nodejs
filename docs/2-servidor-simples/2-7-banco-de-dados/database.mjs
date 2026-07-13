import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync('./db.sqlite');

db.exec(/*sql*/`
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

db.exec(/*sql*/`
  CREATE TABLE IF NOT EXISTS "produtos" (
    "slug" TEXT PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "preco" INTEGER NOT NULL
  );    
`);

const produtos = db.prepare(/*sql*/`SELECT * FROM "produtos"`).all();
const notebook = db.prepare(/*sql*/`SELECT * FROM "produtos" WHERE "slug" = ?`).get("notebook");

// não parametrizado, não use se os valores não forem confiáveis
db.prepare(
    /*sql*/`
  INSERT OR IGNORE INTO "produtos"
    ("slug", "nome", "categoria", "preco")
  VALUES
    ('notebook', 'Notebook', 'eletronicos', 4000)
  `
).run();

// parametrizados
db.prepare(
   /*sql*/ `
  INSERT OR IGNORE INTO "produtos"
    ("slug", "nome", "categoria", "preco")
  VALUES
    (?,?,?,?)
  `
).run("notebook", "Notebook", "eletronicos", 4000);

// Reutilizando statement para múltiplos INSERTs
const insert = db.prepare(
    /*sql*/`
  INSERT OR IGNORE INTO "produtos"
    ("slug", "nome", "categoria", "preco")
  VALUES
    (?, ?, ?, ?)
  `
);
insert.run("notebook", "Notebook", "eletronicos", 4000);
insert.run("mouse", "Mouse", "eletronicos", 400);
insert.run("mesa", "Mesa", "moveis", 2000);
