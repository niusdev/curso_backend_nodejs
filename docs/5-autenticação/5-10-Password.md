#

Assim como o sid da sessão, as senhas devem ser guardadas como hash no banco para que, em caso de vazamento, o atacante não obtenha as senhas em texto.

Como SHA256 é rápido, não serve para senha. Para senhas usamos um algoritmo lento para tornar ataques de força bruta inviáveis.

[Ver mais sobre o algoritimo Scrypt 🔍](https://www.tarsnap.com/scrypt/scrypt.pdf)

- `Scrypt`  
  Função lenta que usaremos para gerar o hash da senha. Existem outras como bcrypt, argon2 (argon2 é considerada a melhor, mas não é nativa do Node).

- `Salt`  
  Valor aleatório combinado à senha para que senhas idênticas resultem em hashes diferentes.

- `dkLen`  
  Tamanho da saída. 32 bytes (256 bits) é um bom padrão.

- `Parâmetros (N, r e p)`  
  Custo de CPU/memória.
  > **Qualquer mudança neles modifica o hash final**.

> Obs.: rainbow tables são tabelas de hashes de senhas comuns que podem ser utilizadas em ataques caso nosso bd seja vazado.

```ts
const SCRYPT_OPTIONS: ScryptOptions = {
  N: 2 ** 14, // uso de cpu/memoria. Potência de 2
  r: 8, // block-size
  p: 1, // iterações paralelas
};

const password = "P@ssw0rd";

const salt = await randomBytesAsync(16);

const dk = await scryptAsync(password, salt, 32, SCRYPT_OPTIONS);

const password_hash = `${salt.toString("hex")}$${dk.toString("hex")}`;
```
