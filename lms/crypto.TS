import {
  type BinaryLike,
  type ScryptOptions,
  createHmac,
  randomBytes,
  scrypt,
  timingSafeEqual,
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

//opções aceitas pelo algoritimo (ver mais sobre)
// N > 15 precisa-se passar outro parametro a respeito do máx. de memória que o algoritimo pode utilizar
// Se mudarmos qualquer opção dessas após salvarmos no bd não conseguiremos mais validar as senhas que estiverem no bd!
const SCRYPT_OPTIONS: ScryptOptions = {
  N: 2 ** 14, //o quanto de memória (CPU) será utilizada para gerar o algoritimo, quanto maior, mais lenta a função se torna (normalmente passamos um valor exponencial de 2, 2 ** 14 é o suficiente)
  r: 8, //block-size (valor recomendado: 8)
  p: 1, //paralelismo (1 é o padrão)
};

async function hashPassword(password: string) {
  const password_normalized = password.normalize("NFC");
  const password_hmac = createHmac("sha256", PEPPER)
    .update(password_normalized)
    .digest();

  const salt = await randomBytesAsync(16);
  const dk = await scryptAsync(password_hmac, salt, 32, SCRYPT_OPTIONS);

  //password_string (formatada dessa forma pois teremos de salvar o salt no bd para podermos validar a senha enviada pela requisição com a armazenada no bd)
  //separamos o salt da dk por $ para facilitar nosso parse futuro
  return `${salt.toString("hex")}$${dk.toString("hex")}`;
}

function parsePasswordHash(password_hash: string) {
  const [stored_salt_hex, stored_dk_hex] = password_hash.split("$");
  const stored_dk = Buffer.from(stored_dk_hex, "hex");
  const stored_salt = Buffer.from(stored_salt_hex, "hex");

  return {
    stored_dk,
    stored_salt,
  };
}

async function verifyPassword(password: string, password_hash: string) {
  const { stored_dk, stored_salt } = parsePasswordHash(password_hash);

  const password_normalized = password.normalize("NFC");
  const password_hmac = createHmac("sha256", PEPPER)
    .update(password_normalized)
    .digest();

  const dk = await scryptAsync(password_hmac, stored_salt, 32, SCRYPT_OPTIONS);

  if (dk.length !== stored_dk.length) return false; //verificação extra não tão necessária que o professor colocou (fiquei na ddúvida se ela não acaba quebrando o propósito do timingSafeEqual)

  return timingSafeEqual(dk, stored_dk);
}

const password = "P@ssw0rd";
const password_hash = await hashPassword(password); //valor que será salvo no BD

const isTrue = await verifyPassword(password, password_hash);
const isFalse = await verifyPassword("12345678", password_hash);
console.log({ isTrue, isFalse });
