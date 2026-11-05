> Vazamento de memória (04:40)

**método:** `.unref()` -> permite que o node pare de funcionar só para ficar mantendo aquela determinada função após todas as demais terem sido encerradas.

## Rate Limit

Limitar a quantidade de requests que o usuário pode fazer por segundo é uma boa prática para mitigar ataques como DDoS.

**Middleware**  
O Rate Limit pode ser criado como um middleware, executado antes do handler.

**Por Rota**  
Rotas sensíveis como /auth/login devem ter limites mais baixos para evitar login através de força bruta.

**WAF (Web Application Firewall)**  
O Rate Limit na aplicação é apenas uma medida extra de segurança, o ideal é ter configurado o Rate Limit diretamente no seu WAF (como Cloudflare e outros).

```ts
import { type Middleware } from "../router.ts";
import { RouteError } from "../utils/route-error.ts";

type Request = {
  hits: number;
  reset: number;
};

/** time in MS, max requests */
export const rateLimit = (time: number, max: number): Middleware => {
  const requests = new Map<string, Request>();

  setInterval(
    () => {
      const now = Date.now();
      for (const [key, item] of requests) {
        if (now >= item.reset) requests.delete(key);
      }
    },
    30 * 60 * 1000,
  ).unref();

  return (req, res) => {
    const now = Date.now();
    const key = req.ip;
    let request = requests.get(key);

    if (request === undefined || now >= request.reset) {
      request = {
        hits: 0,
        reset: now + time,
      };
      requests.set(key, request);
    }

    request.hits += 1;

    // https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/
    const sLeft = Math.ceil((request.reset - now) / 1000);
    const rLeft = Math.max(0, max - request.hits);
    const sTime = Math.ceil(time / 1000);
    res.setHeader("RateLimit", `"default";r=${rLeft};t=${sLeft}`);
    res.setHeader("RateLimit-Policy", `"default";q=${max};w=${sTime}`);

    if (request.hits > max) {
      res.setHeader("Retry-After", `${sLeft}`);
      throw new RouteError(429, "rate-limit");
    }
  };
};
```
