#!/bin/bash
# This code is modified / borrowed from https://stackoverflow.com/a/29754866/159522
# saner programming env: these switches turn some bugs into errors
set -o errexit -o pipefail -o noclobber -o nounset

GREEN='\033[1;32m'
NC='\033[0m' # No Color

h= u= i=

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -h|--host)
    h="$2"
    shift # past argument
    shift # past value
    ;;
    -i|--identity)
    i="$2"
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
ssh -p22 $u@$h  -i $i "mkdir -p /var/www/tech-and-check-alerts" &&
rsync -rav -e "ssh -i $i" --exclude-from='.deployignore' --exclude-from='.gitignore' ./ $u@$h:/var/www/tech-and-check-alerts
echo -e "Delivered."
echo -e "${GREEN}Please remember to manually populate any required configuration files.${NC}"
