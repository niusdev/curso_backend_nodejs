import type { Middleware } from "../Router.ts";
import { RouteError } from "../utils/route-error.ts";

const MAX_BYTES = 5_000_000; //O "_" é ignorado pelo js, é colocado para melhorar a visualização.

export const bodyJSON: Middleware = async (req, res) => {
  if (
    req.headers["content-type"] !== "application/json" &&
    req.headers["content-type"] !== "application/json;charset=utf-8"
  ) {
    return;
  }

  const contentLength = Number(req.headers["content-length"]);

  if (!Number.isInteger(contentLength)) {
    throw new RouteError(400, "content-length inválido.");
  }

  if (contentLength > MAX_BYTES) {
    throw new RouteError(413, "corpo grande.");
  }

  console.log(contentLength);

  const chunks: Buffer[] = [];
  let size = 0;

  try {
    for await (const chunk of req) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); //caso o client mude o encoding da req.
      size += buf.length;
      if (size > MAX_BYTES) {
        throw new RouteError(413, "corpo grande.");
      }
      chunks.push(buf);
    }
  } catch (error) {
    throw new RouteError(400, "request abortado.");
  }
  try {
    const body = Buffer.concat(chunks).toString("utf-8");
    if (body === "") {
      req.body = {};
      return;
    }
    req.body = JSON.parse(body);
  } catch (error) {
    throw new RouteError(400, "json inválido.");
  }
};
