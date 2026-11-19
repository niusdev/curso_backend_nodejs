// Exercício prático
// Crie um servidor HTTP em JavaScript ou TypeScript que:

import { createReadStream } from "node:fs";
import { Core } from "../core/core.ts";
import { pipeline } from "node:stream/promises";

// Receba uma rota como /download;
// Leia um arquivo local chamado entrada.txt;
// Envie o arquivo ao cliente usando createReadStream e pipeline;
// Capture possíveis erros;
// Responda com status 500 caso ocorra algum problema;
// Garanta que o arquivo não seja carregado integralmente na memória.
// Considere o envio de um arquivo JSON ou texto, mas não é necessário converter o conteúdo antes de enviá-lo.

// Recomendação: tente resolver sem consultar o exemplo da documentação.

const core = new Core()
core.router.get('/download', async(req, res) => {
    try {
        res.setHeader("Content-Type", "text/plain; charset=utf-8")

        const readStream = createReadStream(new URL("./entrada.txt", import.meta.url))
        await pipeline(readStream, res)
    } catch (error) {
        console.log(error)
        if (!res.headersSent) {
            res.status(500).end("Erro ao enviar o arquivo.")
        } else {
            res.destroy(error instanceof Error ? error : undefined)
        }
    }
})

core.init()
