import { createServer } from "node:http";
import { Router } from "./Router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";
import { mkdir, writeFile, readdir, readFile } from "node:fs/promises";

const router = new Router();
const produtosDir = "produtos";

router.post("/produtos", async (req, res) => {
    const { categoria, slug } = req.body;
    try {
        await mkdir(`./${produtosDir}/${categoria}`);
    } catch {
        console.log(`${categoria} criada`);
    }
    try {
        await writeFile(`./${produtosDir}/${categoria}/${slug}.json`, JSON.stringify(req.body));
        console.log(`./${produtosDir}/${categoria}/${slug}.json criado`);
        res.status(201).json(`${slug} criado.`);
    } catch {
        res.status(500).json("Erro.");
    }
});

router.get("/produtos", async (req, res) => {
    try {
        const listaArquivos = await readdir(`./${produtosDir}`, { recursive: true });
        const arquivosJson = listaArquivos.filter((item) => item.endsWith(".json"));
        const promises = arquivosJson.map((caminhoArquivo) => readFile(`./${produtosDir}/${caminhoArquivo}`, "utf-8"));
        const conteudos = await Promise.all(promises);
        const produtos = conteudos.map(JSON.parse);
        res.status(200).json(produtos);
    } catch {
        res.status(500).json("Erro.");
    }
});

router.get("/produto", async (req, res) => {
    const categoria = req.query.get("categoria");
    const slug = req.query.get("slug");
    try {
        const conteudo = await readFile(`./${produtosDir}/${categoria}/${slug}.json`, "utf-8");
        const produto = JSON.parse(conteudo);
        res.status(200).json(produto);
    } catch {
        res.status(404).json("Não encontrado.");
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