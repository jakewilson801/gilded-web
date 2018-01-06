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
psql -f ${INIT_SCRIPT} gilded
psql -f ${FIELDS_SCRIPT} gilded
psql -f ${FIELD_IMAGES_SCRIPT} gilded
psql -f ${OCCUPATIONS_SCRIPT} gilded
psql -f ${OCCUPATIONS_IMAGES_SCRIPT} gilded
psql -f ${SCHOOLS_SCRIPT} gilded
psql -f ${PROGRAMS_SCRIPT} gilded
psql -f ${EMPLOYERS} gilded
psql -f ${ACCOUNTS_MIGRATION} gilded
