import { createServer } from "node:http";
import { Router } from "./Router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";
import { criarAula, criarCurso, pegarAulaCurso, pegarAulasCurso, pegarCursos, pegarCursoSlug } from "./database.mjs"



const router = new Router();


router.post("/cursos", (req, res) => {
  const { slug, nome, descricao } = req.body;
  const criado = criarCurso({ slug, nome, descricao });
  console.log(criado)
  if (criado) {
    res.status(201).json("curso criado.");
  } else {
    res.status(400).json("erro ao criar curso!");
  }
});

router.get("/cursos", (req, res) => {
  const cursos = pegarCursos();
  console.log(cursos)
  if (cursos && cursos.length > 0) {
    res.status(201).json(cursos);
  } else {
    res.status(400).json("erro ao buscar cursos!");
  }
});

router.get("/curso", (req, res) => {
  const slug = req.query.get("slug");
  const curso = pegarCursoSlug(slug);
  console.log(curso)
  if (curso) {
    res.status(201).json(curso);
  } else {
    res.status(400).json("erro ao buscar curso!");
  }
});

router.post("/aulas", (req, res) => {
  const { cursoSlug, slug, nome } = req.body;
  const criada = criarAula({ cursoSlug, slug, nome });
  console.log(criada)
  if (criada) {
    res.status(201).json("aula criada.");
  } else {
    res.status(400).json("erro ao criar aula!");
  }
});

router.get("/aulas", (req, res) => {
  const cursoSlug = req.query.get('curso');
  const aulas = pegarAulasCurso(cursoSlug);
  console.log(aulas)
  if (aulas && aulas.length > 0) {
    res.status(201).json(aulas);
  } else {
    res.status(400).json("erro ao buscar aulas!");
  }
});

router.get("/aula", (req, res) => {
  const cursoSlug = req.query.get('curso');
  const aulaSlug = req.query.get('slug');
  const aula = pegarAulaCurso(cursoSlug, aulaSlug);
  console.log(aula)
  if (aula) {
    res.status(201).json(aula);
  } else {
    res.status(400).json("erro ao buscar aula no curso!");
  }
});


const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);

  const handler = router.find(req.method, req.pathname);

  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end("Page not found! 404");
  }
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta: 3000');
})