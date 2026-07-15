import { Core } from "./core/core.ts";
import {
  criarAula,
  criarCurso,
  pegarAulaCurso,
  pegarAulasCurso,
  pegarCursos,
  pegarCursoSlug,
} from "./core/database.ts";

const core = new Core();

core.router.post("/cursos", (req, res) => {
  const { slug, nome, descricao } = req.body;
  const criado = criarCurso({ slug, nome, descricao });
  console.log(criado);
  if (criado) {
    res.status(201).json("curso criado.");
  } else {
    res.status(400).json("erro ao criar curso!");
  }
});

core.router.get("/cursos", (req, res) => {
  const cursos = pegarCursos();
  console.log(cursos);
  if (cursos && cursos.length > 0) {
    res.status(201).json(cursos);
  } else {
    res.status(400).json("erro ao buscar cursos!");
  }
});

core.router.get("/curso", (req, res) => {
  const slug = req.query.get("slug");
  if (slug) {
    const curso = pegarCursoSlug(slug);
    console.log(curso);
    if (curso) {
      res.status(201).json(curso);
    } else {
      res.status(400).json("erro ao buscar curso!");
    }
  }
});

core.router.post("/aulas", (req, res) => {
  const { cursoSlug, slug, nome } = req.body;
  const criada = criarAula({ cursoSlug, slug, nome });
  console.log(criada);
  if (criada) {
    res.status(201).json("aula criada.");
  } else {
    res.status(400).json("erro ao criar aula!");
  }
});

core.router.get("/aulas", (req, res) => {
  const cursoSlug = req.query.get("curso");
  if (cursoSlug) {
    const aulas = pegarAulasCurso(cursoSlug);
    console.log(aulas);
    if (aulas && aulas.length > 0) {
      res.status(201).json(aulas);
    } else {
      res.status(400).json("erro ao buscar aulas!");
    }
  }
});

core.router.get("/aula", (req, res) => {
  const cursoSlug = req.query.get("curso");
  const aulaSlug = req.query.get("slug");
  if (cursoSlug && aulaSlug) {
    const aula = pegarAulaCurso(cursoSlug, aulaSlug);
    console.log(aula);
    if (aula) {
      res.status(201).json(aula);
    } else {
      res.status(400).json("erro ao buscar aula no curso!");
    }
  }
});

core.router.get("/", (req, res) => {
  res.status(200).end("Hello!");
});
core.init();
