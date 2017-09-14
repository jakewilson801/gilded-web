#!/bin/sh

SECRETS_FILE=conf/secrets.zip

if [ ! -f ${SECRETS_FILE} ]; then
  echo "file ${SECRETS_FILE} not fund"
  exit 1
fi

unzip -p ${SECRETS_FILE}
