console.clear();

const base = "http://localhost:3000";

async function streamTeste() {
  const response = await fetch(base + "/download");

  if (!response.ok) {
    throw new Error(`Erro ao baixar: ${response.status}`);
  }

  const body = await response.text();
  console.log(body);
}

await streamTeste();
