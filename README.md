[![Build Status](https://api.travis-ci.com/TechAndCheck/tech-and-check-alerts.svg?branch=main)](https://travis-ci.com/TechAndCheck/tech-and-check-alerts)

# Tech & Check Alerts

A system that sends out a daily tip sheet for fact checkers, developed at the Duke Reporters Lab.

## Installation instructions
This is a node project.  The version of node is specified in `package.json` and we recommend the use of [nvm](https://nvm.sh) for managing your local node versions.

To set up your development environment...

### Install dependencies

```
> yarn install
```

### Set up postgres

This project uses [postgres](https://www.postgresql.org/) to store its data.  You will need to either set up a local copy, or find a hosted solution. Be sure to remember the username and password you set up for this project.

You will need to set up two separate databases: one for testing and one for the actual application.  Having a distinct test database is a code-enforced requirement.

### Set up redis

This project uses [redis](https://redis.io/) as a data store for queues.  You will need to set up a local copy, or find a hosted solution.

### Configure the project

You will need to configure your environment variables.  In production this can be done however your host recommends; in development we recommend using an `.env` file. A template for the contents of `.env` is provided in `.env.template`.

```
> cp .env.template .env
> vi .env
```

The database credentials (e.g. `DATABASE_URL_DEVELOPMENT` and `DATABASE_URL_TEST`) should match the relevant instances of `username` and `databasename` that you set up when installing postgres.

### Run Migrations

```
> yarn migrate
```

### Start the service

```
> yarn start
```

### Run tests

```
> yarn test
```

Or, to start a watcher that runs tests as you change them:
```
> yarn test:watch
```

## Queues

The primary control flow of this project is handled through jobs and queues.  We use [bull](https://www.npmjs.com/package/bull), which is built on top of redis.

Creating a new queue involves making a new directory in the `server/queues` folder with the following files:

* Job Processor :: The job processor is the code that is run whenever a new item (job) is added to the queue.  It takes in job information, does work, and registers the completion of the job. This must export a function that will be called on a job process.
* Job Scheduler :: The job scheduler determines how often jobs are regularly added to this queue.  The possible frequency constants are described in `src/server/queues/constants.js`.  This file must export a class that extends AbstractJobScheduler.
* Queue Factory :: The queue factory points to the processor file and names the queue.  This must export a class that extends AbstractQueueFactory.
* index (aka the "Queue Dict") :: This just returns instantiated versions of the components decribed in this list.  This must export an object with factory, scheduler, and processor attributes.

The best thing to do is look at an existing implemented queue and work from there.

## Continuous integration

This project uses [Travis CI](https://travis-ci.org/TechAndCheck/tech-and-check-alerts) for continuous integration.  This takes the form of:

1. Automated testing which is run on all pull requests.
2. Continuous deployment to our staging server for any commit that is merged into the `master` branch.

For more information about our continuous deployment setup read our [CD documentation](docs/CONTINUOUS_DEPLOYMENT.md).

## Contributing

If you're interested in contributing to this project: thank you! Contributions are made via pull request. Please be sure to review our [contribution guidelines](CONTRIBUTING.md) and [code of conduct](docs/CODE_OF_CONDUCT.md).
