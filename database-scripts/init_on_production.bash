#!/usr/bin/env bash
FIELDS_SCRIPT=fields.sql
FIELD_IMAGES_SCRIPT=fieldImages.sql
OCCUPATIONS_SCRIPT=occupations.sql
OCCUPATIONS_IMAGES_SCRIPT=occupationImages.sql
INIT_SCRIPT=init.sql
EMPLOYERS=employers.sql
ACCOUNTS_MIGRATION=accounts_and_bookmarks_migration.sql

if [ ! -f ${INIT_SCRIPT} ]; then
  INIT_SCRIPT=database-scripts/init.sql
  FIELDS_SCRIPT=database-scripts/fields.sql
  FIELD_IMAGES_SCRIPT=database-scripts/fieldImages.sql
  OCCUPATIONS_SCRIPT=database-scripts/occupations.sql
  OCCUPATIONS_IMAGES_SCRIPT=database-scripts/occupationImages.sql
  SCHOOLS_SCRIPT=database-scripts/schools.sql
  PROGRAMS_SCRIPT=database-scripts/programs.sql
  EMPLOYERS=database-scripts/employers.sql
  ACCOUNTS_MIGRATION=database-scripts/accounts_and_bookmarks_migration.sql
fi

psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${INIT_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${FIELDS_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${FIELD_IMAGES_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${OCCUPATIONS_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${OCCUPATIONS_IMAGES_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${SCHOOLS_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${PROGRAMS_SCRIPT} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${EMPLOYERS} dd1pvhrht3t7ac
psql postgres://mqcmytbkryxdgc:c91cc1a7dd0ba3c2674a9416152f16e8b4acb6d16c6f112592d5d80120e0fe39@ec2-174-129-239-0.compute-1.amazonaws.com:5432/dd1pvhrht3t7ac -f ${ACCOUNTS_MIGRATION} dd1pvhrht3t7ac
