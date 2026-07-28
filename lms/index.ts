import { readFile } from "node:fs/promises";
import { AuthApi } from "./api/auth/index.ts";
import { LmsApi } from "./api/lms/index.ts";
import { Core } from "./core/core.ts";
import { logger } from "./core/middlewares/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";
import { sha256 } from "./api/auth/utils.ts";

const core = new Core();
core.router.use([logger]);

new AuthApi(core).init();
new LmsApi(core).init();

core.router.get("/", async (req, res) => {
  const index = await readFile("./front/index.html");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).end(index);
});

core.router.get("/segura", async (req, res) => {
  const sid = req.cookies["__Secure-sid"]; //nesse caso não estamos lidando com cookies que possam ter o mesmo nome
  if (!sid) {
    throw new RouteError(401, "não autenticado.");
  }

  const sid_hash = sha256(sid);

  const session = core.db
    .query(
      /*SQL*/ `
      SELECT "user_id" FROM "sessions" WHERE "sid_hash" = ?
  `,
    )
    .get(sid_hash);

  if (!session) {
    throw new RouteError(404, "usuário não encontrado.");
  }
  res.status(200).json(session);
});

core.init();
