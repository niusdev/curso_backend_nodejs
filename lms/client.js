console.clear();

const base = 'http://localhost:3000'


const courses = {
    html: {
        slug: "html-e-css",
        title: "HTML e CSS",
        description: "Curso de HTML e CSS para Iniciantes",
        lessons: 40,
        hours: 10,
    },
    javascript: {
        slug: "javascript-completo",
        title: "JavaScript Completo",
        description: "Curso completo de JavaScript",
        lessons: 80,
        hours: 20,
    },
};

const functions = {
    async postCourse() {
        const response = await fetch(base + '/lms/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(courses.javascript)
        });
        const body = await response.json();
        console.table(body);
    }
}

functions[process.argv[2]]();
