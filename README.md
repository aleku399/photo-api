# photo-api

## Getting Started

### Step 1: Install NVM

Install [nvm](https://github.com/creationix/nvm), which will manage the `node` and `npm` versions in your local env. After installing run:

```
$ nvm install
```

This will read the node version detailed in `.nvmrc` and install the project's current `node` and `npm` versions.

### Step 2: Install PostgreSQL

Install PostgreSQL in case it is not already installed by following the OS instructions at [postgresql](http://www.postgresql.org/download). (Make sure you have PostGIS extension installed)

You can also use docker to run your database in development

```
$ docker run --name postgres -v pgdata:/var/lib/postgresql/data -p 5432:5432 -d mdillon/postgis:10-alpine
```

Create the database

```
packages/backend git:(master) ✗ docker exec -it postgres sh
/ # su - postgres
~$ psql
postgres=# create database SACCO-APP_development;
postgres=# \c SACCO-APP_development
postgres=# create database SACCO-APP_test;
```

### Step 3: Install Redis

Install Redis in case it is not already installed by following the OS instructions at [redis](https://redis.io/topics/quickstart).

You can also use docker to run redis in development

```
$ docker run --name redis -p 6379:6379 -d redis:alpine
```

### Step 4: Install Node dependencies

The project uses NPM as package manager to install dependencies consistently. Please DO NOT use yarn.

Within project root run `npm install && npx lerna bootstrap`.


### Step 5: Setup the application

_NOTE:_ all of the commands in this section need to be run from the `packages/backend` sub-directory

You need a `.env` file to run any of the components in development. Use the following to create a new one from the existing example.

```
$ mv .env.example .env
```

The file .env.example will contain list of variables but without values.
Edit `.env` according to your local environment setup. Also add `.env.test` in order to provide testing configs.

In order to setup the development and test databases, you need to provide a [URI](https://www.postgresql.org/docs/current/static/libpq-connect.html) in the `DATABASE_URL` var in `.env` and `.env.test`.

The database for the development environment is `EVAL-CSO_development`.

```
DATABASE_URL=postgresql://[<user>:<password>@localhost]/EVAL-CSO_development
```

The database for the testing environment is `EVAL-CSO_test`

```
DATABASE_URL=postgresql://[<user>:<password>@localhost]/EVAL-CSO_test
```

After creating the database you need to migrate and seed it in the `packages/backend` sub-directory or from the root directory using lerna

```
$ npm run migrate || npx lerna run migrate
$ npm run seed  || npx lerna run seed
```

Other useful scripts you can use to manage the database include;

- `npm run rollback || npx lerna run rollback` to rollback the last migration
- `npm run sequelize -- ANY SEQUELIZE CLI COMMAND` - to run any other sequelize cli commands
-

### Step 9: Run tests

_NOTE:_ all of the commands in this section need to be run from the `packages/backend` sub-directory or from the root directory using lerna.

Ensure test database is setup correctly by running migrations and seeds through:

```
$ NODE_ENV=test npm run migrate
$ NODE_ENV=test npm run seed
```

Run the tests:

```
$ npm test
```

### Step 8: Running the application locally

#### Backend

Start the backend in development

```
$ cd packages/backend
$ npm run dev
```

This will watch typescript files and restart the API when changes are made. You can access the backend api on `http://localhost:4000`

#### Workers

```
$ cd packages/backend
$ npm run work
```

This will start up the workers to complete jobs like sending OTP in development make sure to `` console.log("verification code"`) `` and other notifications.

#### Code Overview

#### Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [expressLogger](https://www.npmjs.com/package/express-pino-logger) - Middleware for logging
- [multer](https://www.npmjs.com/package/multer) - Middleware for handling requests with file
- [bluebird](http://bluebirdjs.com/docs/getting-started.html) - Promise Library being used
- [postgres](https://github.com/brianc/node-postgres) - PostgreSQL client for Node.js
- [bull](https://github.com/OptimalBits/bull) - Redis-based queue for background workers
- [bull-arena](https://www.npmjs.com/package/bull-arena) - An interface for monitoring queue workers
- [nyc](https://github.com/istanbuljs/nyc) - For code coverage
- [sequelize](https://www.npmjs.com/package/sequelize-cli) - Promise-based Node.js ORM for Postgres
- [Typescript](https://www.typescriptlang.org/) - For typing javascript
- [sentry](https://www.npmjs.com/package/@sentry/node) - For Error logging
- [commitizen](https://github.com/commitizen/cz-cli) - For commit message consistency

#### Application structure

- packages
  - backend
    - src
      - app.ts - The entry point to our application. It requires the routes and models.
      - routers - This folder contains the route definitions for our API.
      - arena.ts - The entry point to our queue interface
      - auth - The folder contains all our authentication logic.
      - migrations - The file contains all schema for our postgres database
      - models.ts - This file loads all our postgres models with sequelize.

Each other file in src like user or profile has `routes, operations folder, and model` definition.

#### Error Handling

In the `packages/backend/src/utils`, we define error handling middleware for handling the server error which is passed to sentry by the `next function`

## Additional Information

### Sequelize queries in tests

When running backend tests with the `DEBUG="sequelize:*"` environment variable, you will get debugging output from sequelize. Useful to debug which queries are being run in tests and whether their values match the expected outcome.

### Logging

SQL Logging is turned on by default (except in testing) which can be a little verbose when trying to debug your application locally. You can turn off SQL logging with an environment variable in your local environment. `ENABLE_QUERY_LOGGING=false` will disable SQL logging.

### Tests

#### Running all tests

```
$ cd packages/backend
$ npm run test
```

#### Running a single unit test

```
$ cd packages/backend
$ npm run mocha /path/to/compiled/test.js
```

### Cleaning up compiled files

The compiled files get cleaned up with the following command:

```
$ cd packages/backend
$ npm run clean
```

This runs a script which removes the compiled files in the `dist` directories that contains compiled files

### Upgrading node version

Change the node version at `.nvmrc`. Then install the new version:

```
nvm install
```

### Commit messages

We use [commitizen](https://github.com/commitizen/cz-cli) with [cz-customizable](https://github.com/leoforfree/cz-customizable) as the adapter to structure out commit messages. [cz-customizable](https://github.com/leoforfree/cz-customizable) uses a file named `.cz-config.js` or `.config/cz-config.js` in the project root, near the `package.json` for configuration. You can check out a sample file [here](https://github.com/leonardoanalista/cz-customizable/blob/master/cz-config-EXAMPLE.js)
