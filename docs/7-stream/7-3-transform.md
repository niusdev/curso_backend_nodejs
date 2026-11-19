# Transform

Podemos transformar o dado entre a leitura e a escrita da stream.

- **chunk**  
  É o pedaço de dado da stream.

- **this.push**  
  Envia o dado manipulado para a próxima stream.

- **next**  
  Callback que sinaliza que terminamos de manipular o dado. Pode ser usado para passar também com `next(null, text)`

```ts
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const transform = new Transform({
  transform(chunk, _enc, next) {
    const text = chunk.toString().toUpperCase();
    this.push(text);
    next();
  },
});

await pipeline(
  createReadStream("./entrada.txt"),
  transform,
  createWriteStream("./saida.txt"),
);
```

## zlib

Existem funções nativas que funcionam como uma Transform stream, como a createGzip que irá comprimir os dados antes da escrita deles.

- **createGzip**  
  Comprime a stream.

- **createGunzip**  
  Descomprime a stream.

```ts
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

try {
  await pipeline(
    createReadStream("./entrada.txt"),
    createGzip(),
    createWriteStream("./saida.txt.gz"),
  );
} catch (error) {
  console.error(error);
}
```

# Readline

Lê cada linha de um arquivo utilizando uma `Readable stream`. Serve para processarmos dados onde uma linha nova funciona como um delimitador como `CSV` ou `NDJSON`.

Um problema que podemos enfrentar ao tentar transformar um dado é que não temos controle de onde o pedaço (`chunk`) do dado será cortado.

- **createInterface**  
  Recebe uma `Readable stream` e retorna um objeto do tipo `AsyncIterator`, onde podemos fazer um loop `for await` linha por linha.

- **options**  
  Nas opções você pode passar o input que pode ser uma `Readable stream`. `crlfDelay: Infinity` serve para **_resolver arquivos criados no Windows_** onde a quebra de linha é composta por `\r\n` e não apenas `\n`.

```ts
import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline/promises";

const read = createReadStream("./pessoas.ndjson");
const write = createWriteStream("./pessoas-vitalicio.ndjson");
const lines = createInterface({ input: read, crlfDelay: Infinity });

for await (const line of lines) {
  const obj = JSON.parse(line);
  if (obj.vitalicio === "true") write.write(line + "\n");
}

write.end();
```

# Dúvida que tive:

> > > "No caso desse exemplo, pelo que entendi, fazendo dessa forma onde o chunk é cortado é justamente onde um objeto do json é fechado, certo? Mas e se esse objeto for grande? Como fica o controle do estouro de memória da RAM? E, uma vez que não se há o uso do método pipeline, como fica o backpressure?".

**R:**
Você acertou na leitura da primeira parte e levantou dois pontos críticos de arquitetura em Node.js que muita gente deixa passar nesse exemplo.

### 1. O corte do chunk e o tamanho do objeto (Memória RAM)

Sim, o `readline` garante que você receba a string completa até a quebra de linha (`\n`), ou seja, um objeto JSON inteiro por vez.

Porém, **o `readline` não limita o tamanho da linha**. Ele vai acumulando os _chunks_ do `createReadStream` em um buffer interno na RAM até encontrar o `\n`.

- **O risco:** Se você tiver um arquivo NDJSON corrompido (sem quebras de linha) ou um único objeto JSON gigantesco (ex: um registro com um Base64 de 2GB embutido), o `readline` vai tentar carregar essa linha inteira na memória, o que pode estourar o limite do V8 (_JavaScript heap out of memory_).
- **Como mitigar:** No Node.js mais recente, o `createInterface` aceita a opção `maxLineLength` (ou você mesmo controla o tamanho do buffer dentro de uma `Transform` stream customizada) para lançar um erro caso uma única linha ultrapasse um limite seguro de bytes antes de derrubar o processo.

---

### 2. O problema do Backpressure (sem o `pipeline`)

No código do slide, **o _backpressure_ está completamente quebrado na escrita**.

O `for await (const line of lines)` até gerencia o _backpressure_ da **leitura** (ele pausa o `read` enquanto o bloco do loop não termina), mas ele **ignora** o estado do `write`.

Quando você chama `write.write(line + "\n")`:

1. Esse método retorna um booleano (`true` se o buffer interno de escrita ainda tem espaço; `false` se encheu e você deveria esperar).
2. Como o código ignora esse retorno e continua o loop imediatamente, se o disco de destino for lento (ou se você estiver escrevendo para uma rede/S3) e a leitura for muito rápida, o Node.js vai enfileirar todos os dados na memória RAM esperando o disco conseguir gravar. Resultado: **vazamento/estouro de memória**.

### Como resolver isso mantendo o código limpo?

Você tem duas abordagens principais para respeitar o _backpressure_ nesse cenário:

#### Opção A: Respeitar o retorno de `write.write()` manualmente

Usando o módulo `node:events` (`once`), você pausa o loop até o evento `'drain'` (drenagem) avisar que o buffer de escrita esvaziou:

```javascript
import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { once } from "node:events";

const read = createReadStream("./pessoas.ndjson");
const write = createWriteStream("./pessoas-vitalicio.ndjson");
const lines = createInterface({ input: read, crlfDelay: Infinity });

for await (const line of lines) {
  const obj = JSON.parse(line);
  if (obj.vitalicio === "true") {
    const canContinue = write.write(line + "\n");
    // Se o buffer encheu, aguarda o disco esvaziar antes de ler a próxima linha
    if (!canContinue) {
      await once(write, "drain");
    }
  }
}

write.end();
await once(write, "finish"); // Garante que tudo foi gravado antes de encerrar
```

#### Opção B: Usar `pipeline` com Async Generator (Recomendado)

O `pipeline` do `node:stream/promises` aceita funções geradoras assíncronas (`async function*`) no meio do caminho. Assim, você mantém a simplicidade do `readline` e ganha o controle automático de _backpressure_ e tratamento de erros do `pipeline`:

```javascript
import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline/promises";
import { pipeline } from "node:stream/promises";

const read = createReadStream("./pessoas.ndjson");
const write = createWriteStream("./pessoas-vitalicio.ndjson");
const lines = createInterface({ input: read, crlfDelay: Infinity });

async function* filterVitalicio(source) {
  for await (const line of source) {
    const obj = JSON.parse(line);
    if (obj.vitalicio === "true") {
      yield line + "\n"; // O pipeline só pede o próximo 'yield' quando o 'write' estiver pronto
    }
  }
}

await pipeline(lines, filterVitalicio, write);
```

Essa segunda abordagem junta o melhor dos dois mundos: a leitura linha a linha do `readline` e o gerenciamento de memória e erros do `pipeline`.

## Dúvidas do código de solução:

Esse trecho usa dois recursos muito poderosos do JavaScript moderno: **Async Generators** (`async function*`) e o operador **`yield`**.

---

### 1. O que significa `async function*`?

Na sintaxe normal, uma `function` executa do início ao fim e retorna um valor único. Uma `async function` faz o mesmo, mas retorna uma `Promise` resolvida com esse valor.

Já o asterisco (`function*`) transforma a função em um **Generator** (gerador): uma função que pode **pausar a execução no meio** e retomar depois, entregando valores sob demanda (um por vez), em vez de montar tudo de uma vez.

Quando você junta os dois (`async function*`), você cria um **Async Generator**:

- Ele pode **pausar e entregar valores sob demanda** (`yield`);
- E, ao mesmo tempo, pode **esperar operações assíncronas** (`await`) enquanto faz isso.

---

### 2. O que significa `yield`?

O `yield` funciona como uma **"pausa com entrega"**:

1. Quando o código chega em `yield line + "\n"`, ele **entrega** essa linha filtrada para quem está consumindo o gerador (no caso, o `pipeline` enviando para o `write`).
2. Em seguida, a execução da `filterVitalicio` **congela exatamente ali**.
3. Ela só volta a rodar a próxima iteração do `for await` quando o consumidor disser _"ok, já processei/escrevi esse item, pode mandar o próximo"_.

---

### 3. Por que eles são necessários nesse caso?

Sem `async function*` e `yield`, para filtrar um arquivo gigante sem estourar a memória, você precisaria criar manualmente uma stream de transformação (`new Transform({ transform(chunk, enc, cb) { ... } })`), lidando com buffers parciais, conversões de texto e chamadas de `cb()` manualmente.

Com `async function*` + `yield`, você ganha três coisas essenciais:

1. **Controle natural de _backpressure_:** Como a função pausa no `yield` até o destino (`write`) estar pronto para receber mais dados, você nunca acumula milhões de linhas na RAM esperando o disco terminar de escrever.
2. **Processamento constante em memória (streaming de verdade):** Mesmo que `pessoas.ndjson` tenha **50 GB**, o `for await` lê uma linha, o `if` decide se passa, o `yield` manda adiante, e a memória ocupada continua mínima.
3. **Código legível e linear:** Você escreve uma lógica simples de `for` e `if`, sem precisar montar uma máquina de estados complexa de _streams_ só para filtrar dados.

_(Nota: o `pipeline` do Node.js aceita nativamente um **Async Generator** como estágio intermediário — ele lê do `source`, passa para o `filterVitalicio` e manda o que der `yield` direto para o `write`, conectando o fluxo e os erros automaticamente.)_
