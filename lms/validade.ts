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

function email(x: string) {
  return /^[^@]+@[^@]+$/.test(x) ? x : undefined;
}
