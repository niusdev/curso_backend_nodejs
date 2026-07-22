import { Core } from "../core.ts";
import type { Handler } from "../Router.ts";

export abstract class CoreProvider {
  core: Core;
  router: Core["router"];
  db: Core["db"];
  constructor(core: Core) {
    this.core = core;
    this.router = core.router;
    this.db = core.db;
  }
}

export abstract class Api extends CoreProvider {
  /** Utilize para registrar os handlers */
  handlers: Record<string, Handler> = {};
  /**Utilize para criar as tabelas */
  tables() {}
  /**Registre as rotas da API aqui */
  routes() {}
  init() {
    this.tables();
    this.routes();
  }
}

export abstract class Query {
  db: Core["db"];
  constructor(db: Core["db"]) {
    this.db = db;
  }
}
