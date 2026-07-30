import {
  type BinaryLike,
  type ScryptOptions,
  createHmac,
  randomBytes,
  scrypt,
} from "node:crypto";
import { promisify } from "node:util";

const randomBytesAsync = promisify(randomBytes);

const PEPPER = "segredo";

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options?: ScryptOptions,
) => Promise<Buffer> = promisify(scrypt);

const salt = await randomBytesAsync(16);

//opções aceitas pelo algoritimo (ver mais sobre)
// N > 15 precisa-se passar outro parametro a respeito do máx. de memória que o algoritimo pode utilizar
// Se mudarmos qualquer opção dessas após salvarmos no bd não conseguiremos mais validar as senhas que estiverem no bd!
const SCRYPT_OPTIONS: ScryptOptions = {
  N: 2 ** 14, //o quanto de memória (CPU) será utilizada para gerar o algoritimo, quanto maior, mais lenta a função se torna (normalmente passamos um valor exponencial de 2, 2 ** 14 é o suficiente)
  r: 8, //block-size (valor recomendado: 8)
  p: 1, //paralelismo (1 é o padrão)
};

const password = "P@ssw0rd";
const password_normalized = password.normalize("NFC");
const password_hmac = createHmac("sha256", PEPPER)
  .update(password_normalized)
  .digest();

const dk = await scryptAsync(password_hmac, salt, 32, SCRYPT_OPTIONS);

//password_string (formatada dessa forma pois teremos de salvar o salt no bd para podermos validar a senha enviada pela requisição com a armazenada no bd)
//separamos o salt da dk por $ para facilitar nosso parse futuro
const password_hash = `${salt.toString("hex")}$${dk.toString("hex")}`;

console.log(password_hash);
