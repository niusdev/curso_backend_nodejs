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

const scryptAsync: (
  password: BinaryLike,
  salt: BinaryLike,
  keylen: number,
  options?: ScryptOptions,
) => Promise<Buffer> = promisify(scrypt);

export class Password {
  PEPPER: string;
  NORM = "NFC";
  SCRYPT_OPTIONS: ScryptOptions = {
    //opções aceitas pelo algoritimo scrypt (ver mais sobre)
    N: 2 ** 14, //o quanto de memória (CPU) será utilizada para gerar o algoritimo, quanto maior, mais lenta a função se torna (normalmente passamos um valor exponencial de 2, 2 ** 14 é o suficiente)
    r: 8, //block-size (valor recomendado: 8)
    p: 1, //paralelismo (1 é o padrão)
  };
  DK_LEN = 32;
  SALT_LEN = 16;
  constructor(PEPPER: string) {
    this.PEPPER = PEPPER;
  }

  async hash(password: string) {
    const password_normalized = password.normalize(this.NORM);
    const password_hmac = createHmac("sha256", this.PEPPER)
      .update(password_normalized)
      .digest();

    const salt = await randomBytesAsync(this.SALT_LEN);
    const dk = await scryptAsync(
      password_hmac,
      salt,
      this.DK_LEN,
      this.SCRYPT_OPTIONS,
    );

    //password_string (formatada dessa forma pois teremos de salvar o salt no bd para podermos validar a senha enviada pela requisição com a armazenada no bd)
    //separamos o salt da dk por $ para facilitar nosso parse futuro
    return (
      `scrypt$v=1$norm=${this.NORM}$N=${this.SCRYPT_OPTIONS.N},r=${this.SCRYPT_OPTIONS.r},p=${this.SCRYPT_OPTIONS.p}` +
      `$${salt.toString("hex")}$${dk.toString("hex")}`
    );
  }

  parse(password_hash: string) {
    const [id, v, norm, options, stored_salt_hex, stored_dk_hex] =
      password_hash.split("$");
    const stored_dk = Buffer.from(stored_dk_hex, "hex");
    const stored_salt = Buffer.from(stored_salt_hex, "hex");
    const stored_norm = norm.replace("norm=", "");
    const stored_options = options
      .split(",")
      .reduce<Record<string, number>>((acc, kv) => {
        const [k, v] = kv.split("=");
        acc[k] = Number(v);
        return acc;
      }, {});
    return {
      stored_options,
      stored_norm,
      stored_dk,
      stored_salt,
    };
  }

  async verify(password: string, password_hash: string) {
    const { stored_options, stored_norm, stored_dk, stored_salt } =
      this.parse(password_hash);

    const password_normalized = password.normalize(stored_norm);
    const password_hmac = createHmac("sha256", this.PEPPER)
      .update(password_normalized)
      .digest();

    const dk = await scryptAsync(
      password_hmac,
      stored_salt,
      this.DK_LEN,
      stored_options,
    );

    if (dk.length !== stored_dk.length) return false; //verificação extra não tão necessária que o professor colocou (fiquei na ddúvida se ela não acaba quebrando o propósito do timingSafeEqual)

    return timingSafeEqual(dk, stored_dk);
  }
}

const password = "P@ssw0rd";
const pass = new Password("segredo");
const password_hash = await pass.hash(password); //valor que será salvo no BD

const isTrue = await pass.verify(password, password_hash);
const isFalse = await pass.verify("12345678", password_hash);
console.log({ isTrue, isFalse });
