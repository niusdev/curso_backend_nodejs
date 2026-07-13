# Exercício

1.  Crie um banco de dados lms.sqlite
    Com as seguintes tabelas e configurações:

    PRAGMA foreign_keys = 1;
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;

    PRAGMA cache_size = 2000;
    PRAGMA busy_timeout = 5000;
    PRAGMA temp_store = MEMORY;

    CREATE TABLE IF NOT EXISTS "cursos" (
    "id" INTEGER PRIMARY KEY,
    "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
    ) STRICT;

    CREATE TABLE IF NOT EXISTS "aulas" (
    "id" INTEGER PRIMARY KEY,
    "curso_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL COLLATE NOCASE,
    "nome" TEXT NOT NULL,
    FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
    UNIQUE("curso_id", "slug")
    ) STRICT;

2.  Crie as seguintes rotas:
    POST /cursos ✅
    - Cria um curso, o corpo deve seguir o banco de dados

    POST /aulas ✅
    - Cria uma aula, o corpo deve seguir o banco de dados

    GET /cursos ✅
    - Lista todos os cursos

    GET /curso?slug=slug_curso ✅
    - Pega um curso por slug

    GET /aulas?curso=slug_curso ✅
    - Listas todas as aulas do curso por slug

    GET /aula?curso=slug_curso&slug=slug_aula ✅
    - Pega a aula usando o slug do curso e da aula

3.  try/catch também pega erros em database, use para não quebrar a aplicação ✅
