/**trim e não aceita cadeia vazia */
function string(x: unknown) {
  if (typeof x !== "string") return undefined;
  const s = x.trim();
  if (s.length === 0) return undefined;
  return s;
}

/**se string for number like, retorna como number */
function number(x: unknown) {
  if (typeof x === "number") return Number.isFinite(x) ? x : undefined;

  if (typeof x === "string" && x.trim().length !== 0) {
    const n = Number(x);
    return Number.isFinite(n) ? n : undefined;
  }

  return undefined;
}

/**aceita valores como true, '1', 1 , 'on' */
function boolean(x: unknown) {
  if (x === true || x === 1 || x === "1" || x === "on") return true;
  if (x === false || x === 0 || x === "0" || x === "off") return false;
  return undefined;
}

/**verifica se é um {} */
function object(x: unknown): Record<string, unknown> | undefined {
  return typeof x === "object" && x !== null && !Array.isArray(x)
    ? (x as Record<string, unknown>)
    : undefined;
}

const email_re = /^[^@]+@[^@]+\.[^@]+$/;

function email(x: unknown) {
  const s = string(x)?.toLowerCase();
  if (s === undefined) return undefined;
  return email_re.test(s) ? s : undefined;
}

const password_re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

/**mín. 10 e no máx. 256 caracteres, sendo pelo menos uma letra minúscula, uma maiúscula e um dígito.*/
function password(x: unknown) {
  if (typeof x !== "string") return undefined;
  if (x.length < 10 || x.length > 256) return undefined;
  return password_re.test(x) ? x : undefined;
}
