## Description

It's a simple NestJS application - authentication and authorization api included


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# Generate migrations
$ npm run migration:generate -- ./src/database/migrations/{Give Some Name to Your Migration or use timestamp}

# Run migrations
$ npm run migration:run
```