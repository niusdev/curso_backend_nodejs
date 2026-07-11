import { createServer } from "node:http";
import { Router } from "./Router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";

//router
const router = new Router();


//routes
router.get('/', (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).end("Home!");
})

router.get('/contato', (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200).end("Contato.");
})

router.get('/produtos/notebook', (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(200);
    res.end(`Produto - Notebook - ${req.query}`);
})

router.post("/produtos", async (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(201).end(`Produto adicionado! ${req.body}`);
})

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