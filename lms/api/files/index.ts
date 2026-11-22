import { stat } from "node:fs/promises";
import { Api } from "../../core/utils/abstract.ts";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { v } from "../../core/utils/validate.ts";
import path from "node:path";
import { checkETag, mimeType } from "./utils.ts";
import { RouteError } from "../../core/utils/route-error.ts";

export class FilesApi extends Api {
  handlers = {
    sendFile: async (req, res) => {
      const name = v.file(req.params.name);
      const filePath = `./files/${name}`;
      const ext = path.extname(name);
      let st;
      try {
        st = await stat(filePath);
      } catch (error) {
        throw new RouteError(404, "arquivo não encontrado.");
      }
      const etag = `W/${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}`;
      console.log(etag);
      res.setHeader("ETag", etag);
      res.setHeader("Content-Length", st.size);
      res.setHeader("Last-Modified", st.mtime.toUTCString());
      res.setHeader(
        "Content-Type",
        mimeType[ext] || "application/octet-stream",
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
      if (checkETag(req.headers["if-none-match"], etag)) {
        res.status(304);
        res.end();
        return;
      }

      res.status(200);
      const file = createReadStream(filePath);
      await pipeline(file, res);
    },
    uploadFile: async (req, res) => {
      const name = req.headers["x-filename"];
      const writeStream = createWriteStream(`./files/${name}`);
      await pipeline(req, writeStream);
      res.end("ok");
    },
  } satisfies Api["handlers"];

  routes(): void {
    this.router.get("/files/:name", this.handlers.sendFile);
    this.router.post("/files", this.handlers.uploadFile);
  }
}
