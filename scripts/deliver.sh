#!/bin/bash
# This script will deliver a (slight subset) of the local file contents for this project
# to a remote server.  It is primarily used by Travis as part of our continuous integration
# process, but in theory it could be invoked by a developer directly to do a hot patch.
#
# The script takes in the hostname and username, and invokes SSH to deliver the relevant
# file set.  It does NOT take an identity file, so the relevant key must be explicitly
# ssh-add`d before invoking this script.
#
# This code is modified / borrowed from https://stackoverflow.com/a/29754866/159522

# saner programming env: these switches turn some bugs into errors
set -o errexit -o pipefail -o noclobber -o nounset

GREEN='\033[1;32m'
NC='\033[0m' # No Color

h= u=

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -h|--host)
    h="$2"
    shift # past argument
    shift # past value
    ;;
    -u|--user)
    u="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done

# handle non-option arguments
if [ -z "$h"  ]; then
    echo "$0: A host (-h) must be provided."
    exit 4
fi

# Copy everything over to the server in question
echo "Delivering files to $u@$h:/var/www/tech-and-check-alerts"
ssh -p22 $u@$h "mkdir -p /var/www/tech-and-check-alerts" &&
rsync -rav -e "ssh" --exclude-from='.deployignore' --exclude-from='.gitignore' ./ $u@$h:/var/www/tech-and-check-alerts
echo -e "Delivered."
echo -e "${GREEN}Please remember to manually populate any required configuration files.${NC}"
