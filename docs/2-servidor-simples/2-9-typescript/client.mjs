const urlBase = 'http://localhost:3000'

await fetch(urlBase + '/cursos', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "slug": "html",
        "nome": "HTML",
        "descricao": "Curso de HTML",
    })
});

await fetch(urlBase + '/cursos', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "slug": "javascript",
        "nome": "JavaScript",
        "descricao": "Curso de Javascript",
    })
});

await fetch(urlBase + '/aulas', {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "slug": "html_semantico",
        "nome": "HTML Semântico",
        "cursoSlug": "html",
    })
});

const cursos = await fetch(urlBase + "/cursos").then((r) => r.json());
console.log("Cursos: ", cursos);

const curso = await fetch(urlBase + "/curso?slug=javascript").then((r) => r.json());
console.log("Curso por Slug: ", curso);

const aulas = await fetch(urlBase + "/aulas?curso=html").then((r) => r.json());
console.log("Aulas por Curso Slug: ", aulas);

const aula = await fetch(urlBase + "/aula?curso=html&slug=html_semantico").then((r) => r.json());
console.log("Aula do Curso Slug: ", aula);

