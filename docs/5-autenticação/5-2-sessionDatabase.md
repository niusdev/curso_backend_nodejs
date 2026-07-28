# Session Database

O `sid` da sessão deve ser guardado no banco de dados como um `hash` e com informações extras sobre o mesmo.

- `sid_hash`  
  Hash do Identificador

- `user_id`  
  Id do usuário

- `expires`  
  Unix Time com a validade

- `ip`  
  Ip de onde a sessão foi iniciada

- `ua`  
  User Agent de onde a sessão foi iniciada

- `revoked`  
  Se a sessão foi revogada ou não

```ts
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid_hash" TEXT PRIMARY KEY, -- BLOB
  "user_id" INTEGER NOT NULL,
  "created" INTEGER NOT NULL DEFAULT (STRFTIME('%s', 'NOW')),
  "expires" INTEGER NOT NULL,
  "ip" TEXT,
  "ua" TEXT,
  "revoked" INTEGER NOT NULL DEFAULT 0 CHECK ("revoked" IN (0,1)),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
) WITHOUT ROWID, STRICT;

CREATE INDEX IF NOT EXISTS "idx_session_user" ON "sessions" ("user_id");
```
