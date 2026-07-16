import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { Router } from "./Router.ts";
import { customRequest } from "./http/custom-request.ts";
import { customResponse } from "./http/custom-response.ts";

export class Core {
  router: Router;
  server: Server;
  constructor() {
    this.router = new Router();
    this.server = createServer(this.handler);
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    const req = await customRequest(request);
    const res = customResponse(response);

    const matched = this.router.find(req.method || "", req.pathname);
    if (!matched) return res.status(404).end("Page not found! 404");

    const { route, params } = matched;
    req.params = params;
    await route(req, res);
  };

  init() {
    this.server.listen(3000, () => {
      console.log("Servidor rodando na porta: 3000");
    });
  }
}
