import { Core } from "./core/core.ts";
import { pegarCursoSlug } from "./core/database.ts";

const core = new Core();

core.router.get("/curso/:slug", (req, res) => {
  const { slug } = req.params;
  console.log(slug);
  const curso = pegarCursoSlug(slug);

  if (curso) {
    res.status(201).json(curso);
  } else {
    res.status(400).json("erro ao buscar curso!");
  }
});

core.router.get("/", (req, res) => {
  res.status(200).json("Hello!");
});
core.init();
