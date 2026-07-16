import type { CustomRequest } from "./http/custom-request.ts";
import type { CustomResponse } from "./http/custom-response.ts";

type Handler = (
  req: CustomRequest,
  res: CustomResponse,
) => Promise<void> | void;

type RouteRegistry = Record<string, Handler>;

export class Router {
  routes: Record<string, RouteRegistry> = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    HEAD: {},
  };
  get(route: string, handler: Handler) {
    this.routes["GET"][route] = handler;
  }
  post(route: string, handler: Handler) {
    this.routes["POST"][route] = handler;
  }
  put(route: string, handler: Handler) {
    this.routes["PUT"][route] = handler;
  }
  delete(route: string, handler: Handler) {
    this.routes["DELETE"][route] = handler;
  }
  head(route: string, handler: Handler) {
    this.routes["HEAD"][route] = handler;
  }
  find(method: string, pathname: string) {
    //isola rotas por método passado na requisição
    const routesByMethod = this.routes[method];
    if (!routesByMethod) return null;

    //dentro das rotas daquele método de requisição, busca-se uma correspondente a rota passada na requisição
    const matchedRoute = routesByMethod[pathname];
    if (matchedRoute) return { route: matchedRoute, params: {} };

    //abaixo lido com as rotas dinâmicas presentes no método
    // console.log(route);

    // console.log(routesByMethod);

    //dividindo a rota passada na requisição em partes
    const reqParts = pathname.split("/").filter(Boolean);

    //percorrer as rotas presentes no método
    for (const route of Object.keys(routesByMethod)) {
      if (!route.includes(":")) continue; //pula as rotas estáticas
      const routeParts = route.split("/").filter(Boolean); //dividindo as rotas dinâmicas presentes no método em partes

      if (reqParts.length !== routeParts.length) continue; //pula as rotas com quantidade de partes diferentes as das que foram definidas
      if (reqParts[0] !== routeParts[0]) continue; //pula as rotas cujo a primeira parte da requisição é diferente a primeira parte da rota definida

      // console.log(routeParts); //rotas dinâmicas do método
      // console.log(reqParts); //rota da requisição

      const params: Record<string, string> = {}; //parametros presentes na requisição
      let ok = true; //variável que informa se a rota está correta

      //percorro cada parte da requisição
      for (let i = 0; i < reqParts.length; i++) {
        const segment = routeParts[i]; //parte correspondente da rota definida
        const value = reqParts[i]; //parte da requisição a ser comparada
        if (segment.startsWith(":")) {
          params[segment.slice(1)] = value;
        } else if (segment != value) {
          ok = false; //é false quando a rota  é estática, porém na requisição foi passado um valor diferente pora aquela parte, ou seja, diz que está na rota errada
          break;
        }

        // console.log(params);
      }

      if (ok) {
        return { route: routesByMethod[route], params }; //retorna a rota correspondente se existir
      }
    }

    return null;
  }
}
