import { Core } from "./core/core.ts";
import { logger } from "./core/middlewares/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";

const core = new Core();
core.router.use([logger]);
core.db.exec(/*sql*/ `
  CREATE TABLE IF NOT EXISTS  "products" (
    "id" INTEGER PRIMARY KEY,
    "name" TEXT,
    "slug" TEXT NOT NULL UNIQUE,
    "price" INTEGER 
  );

  INSERT OR IGNORE INTO "products" (
    "name", "slug", "price"
  ) VALUES ('Notebook', 'notebook', 3000)

  `);
core.router.get("/products/:slug", (req, res) => {
  const { slug } = req.params;
  const product = core.db
    .query(
      /*SQL*/ `
    SELECT * FROM "products" WHERE "slug" = ?
  `,
    )
    .get(slug);
  if (!product) {
    throw new RouteError(404, "produto não encontrado");
  }
  res.status(200).json(product);
});

core.router.get("/", (req, res) => {
  res.status(200).json("Hello!");
});

core.init();
