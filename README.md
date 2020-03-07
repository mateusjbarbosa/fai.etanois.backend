[![Build Status](https://travis-ci.com/mateusjbarbosa/fai.etanois.backend.svg?token=x1ZxjfWJhGdcM799138s&branch=master)](https://travis-ci.com/mateusjbarbosa/fai.etanois.backend)

# Documentação do backend para o projeto Etanóis

Para a execução do projeto localmente basta, primeiramente, executar _docker-compose_:

```bash
docker-compose up
```

Caso não queira ver o _console_ adicione _-d_ ao fim do comando.
Logo em seguida execute:

```bash
npm install
```

Esse comando instalará todas as depêndencia do projeto. Para a executar a aplicação:

```bash
npm start
```

## Portas usadas:

- 5432: postgresql;
- 8080: pgadmin;
- 80: api;

Para a execução dos testes unitários:

```bash
npm run unit-test
```
