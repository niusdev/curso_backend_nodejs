# Exercício

1.  Crie 3 rotas
    POST /produtos
    GET /produtos
    GET /produto?categoria=valor&slug=valor

2.  POST /produtos
    Deve permitir a escrita de um json em um arquivo:
    {
    "nome": "Notebook",
    "slug": "notebook",
    "categoria": "eletronicos",
    "preco": 4000
    }

    O arquivo gerado deve ser: /produtos/${categoria}/${slug}.json

3.  GET /produtos
    Retorna uma lista com todos os dados de todos os produtos em /produtos

4.  GET /produto?categoria=valor&slug=valor
    Retorna o produto em: /produtos/${categoria}/${slug}.json

5.  Use try/catch para evitar quebrar os servidor. Sirva erros ao cliente em caso de erro.
