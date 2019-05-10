[![Build Status](https://travis-ci.org/TechAndCheck/tech-and-check-alerts.svg?branch=master)](https://travis-ci.org/TechAndCheck/tech-and-check-alerts)

# Tech & Check Alerts

A system that sends out a daily tip sheet for fact checkers, developed at the Duke Reporters Lab.

## Installation instructions
This is a node project, to set up your development environment...

### Install dependencies

```
> yarn install
```

### Set up postgres

This project uses [postgres](https://www.postgresql.org/) to store its data.  You will need to either set up a local copy, or find a hosted solution.

### Configure the project

You will need to configure your environment variables.  In production this can be done however your host recommends; in development we recommend using an .env file.

The environment variables used in this project are:

* DATABASE_URL_PRODUCTION :: The full database url to be used in production.
* DATABASE_URL_DEVELOPMENT :: The full database url to be used in development.
* DATABASE_URL_TEST :: The full database url to be used in testing.

Database urls will look something like `postgresql://username:password@localhost/dbname`

A template for the contents of `.env` is provided in `.env.example`.

```
> cp .env.example .env
> vi .env
```

### Run Migrations

```
> yarn migrate
```

### Start the service

```
> yarn start
```

## Contributing

If you're interested in contributing to this project: thank you! Contributions are made via pull request. Please be sure to review our [contribution guidelines](CONTRIBUTING.md) and [code of conduct](docs/CODE_OF_CONDUCT.md).
