import type { ServerResponse } from "node:http";

export interface CustomResponse extends ServerResponse {
  status(code: number): CustomResponse;
  json(data: any): void;
  setCookie(cookie: string): void;
}

export function customResponse(response: ServerResponse) {
  const res = response as CustomResponse;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    try {
      const body = JSON.stringify(data);
      res.setHeader("Content-Type", "application/json");
      res.end(body);
    } catch (error) {
      res.status(500).end("error");
    }
  };
  res.setCookie = (cookie) => {
    const current = res.getHeader("Set-Cookie");

    // nada setado ainda -> começa a lista
    if (current === undefined) {
      res.setHeader("Set-Cookie", [cookie]);
      return;
    }

    // já é uma lista -> faz o push
    if (Array.isArray(current)) {
      current.push(cookie);
      res.setHeader("Set-Cookie", current);
      return;
    }

    // havia um único valor -> vira lista com os dois
    res.setHeader("Set-Cookie", [String(current), cookie]);
  };

  return res;
}
