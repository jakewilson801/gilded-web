#!/bin/sh

SECRETS_FILE=secrets.txt

if [ ! -f ${SECRETS_FILE} ]; then
  echo "file ${SECRETS_FILE} not found"
  exit 1
fi
zip -me secrets.zip ${SECRETS_FILE}
