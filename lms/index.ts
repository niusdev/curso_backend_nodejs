import { Core } from "./core/core.ts";
import { pegarCurso } from "./core/database.ts";
import { logger } from "./core/middlewares/logger.ts";
import { RouteError } from "./core/utils/route-error.ts";

const core = new Core();
core.router.use([logger]);

core.router.get("/curso/:slug", (req, res) => {
  const { slug } = req.params;
  const curso = pegarCurso(slug);
  if (!curso) {
    throw new RouteError(404, "curso não encontrado");
  }
  res.status(200).json(curso);
});

core.router.get("/", (req, res) => {
  res.status(200).json("Hello!");
});

core.init();
