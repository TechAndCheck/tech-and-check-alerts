# Continuous Deployment

Our continuous integration pipeline will also automatically deploy updated code in order to save us time and prevent the risk for human error on deployment.

Currently automated deployment only occurs for our staging server.

### Travis variables

Staging continuous deployment is triggered by commits made to the `master` branch.

There are several Travis variables that need to be configured for the staging continuous deployment to work:

* `$STAGING_BRANCH`: specifies which branch should trigger deployments to staging on commit.
* `$STAGING_SERVER`: the hostname / IP of the staging server.
* `$STAGING_SERVER_USER`: the username that CD should use when deploying to staging server.

There must also be a root level `deploy_key.enc` checked into the repository.
It is advised to also include a `deploy_key.pub` in the root as well so that anybody can create a new deployment server without having to regenerate a new key pair.

### Deployment keys

The deployment key pair is checked into this repository.  Travis is the only service that is capable of decypting the private key, but the public key can be listed as an authorized key for any server that should be a part of the CD pipeline.

For Continuous Deployment to work it must be possible to log into `$STAGING_SERVER` as `$STAGING_SERVER_USER` using the private key that was encrypted and sittign in this repository under `deploy_key.enc`.  The public key associated with this private key exists in `deploy_key.pub`.

[A portion of this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-1604) explains how to set up users with SSH keys.

### Updating the deployment key

If you need to set up a new deployment key pair (e.g. if the original key pair is somehow compromised) you should follow the steps in [this article](https://github.com/dwyl/learn-travis/blob/master/encrypted-ssh-keys-deployment.md).

Note: you would also have to update the travis.yml with the new decryption variables.

### CD server configuration

The CD server must be set up in the following way:

1. The server must be running PM2.
2. The code must be deployed to `/var/www/tech-and-check-alerts` and that directory must be writable by `$STAGING_SERVER_USER`
3. An initial deployment should be done manually.  This means installing key project dependencies, configuring the server and `.env` file, and making sure that the service can run.

Once the server is set up, Travis needs to be updated to reflect the hostname / user name 
