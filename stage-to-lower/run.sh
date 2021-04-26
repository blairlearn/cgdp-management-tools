#!/bin/bash
#
# Minimal script to facilitate running the stage-to-lower script from CI.
#
if [[ -z $USERNAME || -z $ACSF_API_KEY || -z $FACTORY_HOST || -z $TARGET ]];
then
    echo 'The USERNAME, ACSF_API_KEY, FACTORY_HOST, and TARGET variables must be set.'
    exit 1
fi

export NODE_CONFIG="{ \"factoryConnection\": { \"username\": \"${USERNAME}\", \"apikey\": \"${ACSF_API_KEY}\", \"factoryHost\": \"${FACTORY_HOST}\" } }"

cd $(dirname $0)

npm ci
node index.js $TARGET

if [[ $? -eq 0 ]];
then
    echo 'Completed.'
    echo
    echo 'Please remember to login and run post-stage-dev.sh or post-stage-test.sh'
fi
