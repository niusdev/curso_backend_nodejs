import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { Router } from "./Router.ts";
import { customRequest } from "./http/custom-request.ts";
import { customResponse } from "./http/custom-response.ts";
import { bodyJSON } from "./middlewares/body-json.ts";
import { RouteError } from "./utils/route-error.ts";
import { Database } from "./database.ts";

export class Core {
  router: Router;
  server: Server;
  db: Database;
  constructor() {
    this.router = new Router();
    this.router.use([bodyJSON]);
    this.server = createServer(this.handler);
    this.db = new Database("./lms.sqlite");
  }

  handler = async (request: IncomingMessage, response: ServerResponse) => {
    try {
      const req = await customRequest(request);
      const res = customResponse(response);

      //executa middlewares globais
      for (const middlware of this.router.middlewares) {
        await middlware(req, res);
      }

      //faz o match entre a rota da requisição e a rota definida na api.
      const matched = this.router.find(req.method || "", req.pathname);
      if (!matched) {
        throw new RouteError(404, "não encontrada.");
      }

      const { route, params } = matched;
      req.params = params;

      //executa middlewares da rota
      for (const middleware of route.middlewares) {
        await middleware(req, res);
      }

      await route.handler(req, res);
    } catch (error) {
      if (error instanceof RouteError) {
        console.error(
          `${error.status} ${error.message} | ${request.method} ${request.url}`,
        );
        response.statusCode = error.status;
        response.setHeader("Content-Type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: error.message }),
        );
      } else {
        console.error(error);
        response.statusCode = 500;
        response.setHeader("Content-Type", "application/problem+json");
        response.end(
          JSON.stringify({ status: response.statusCode, title: "error." }),
        );
      }
    }
  };

  init() {
    this.server.listen(3000, () => {
      console.log("Servidor rodando na porta: 3000");
    });
  }
}
