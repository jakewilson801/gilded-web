#!/usr/bin/env bash
FIELDS_SCRIPT=fields.sql
FIELD_IMAGES_SCRIPT=fieldImages.sql
OCCUPATIONS_SCRIPT=occupations.sql
OCCUPATIONS_IMAGES_SCRIPT=occupationImages.sql
SCHOOLS=schools.sql
PROGRAMS=programs.sql
INIT_SCRIPT=init.sql
EMPLOYERS=employers.sql

if [ ! -f ${INIT_SCRIPT} ]; then
  INIT_SCRIPT=database-scripts/init.sql
  FIELDS_SCRIPT=database-scripts/fields.sql
  FIELD_IMAGES_SCRIPT=database-scripts/fieldImages.sql
  OCCUPATIONS_SCRIPT=database-scripts/occupations.sql
  OCCUPATIONS_IMAGES_SCRIPT=database-scripts/occupationImages.sql
  SCHOOLS_SCRIPT=database-scripts/schools.sql
  PROGRAMS_SCRIPT=database-scripts/programs.sql
  EMPLOYERS=database-scripts/employers.sql
fi

psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${INIT_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${FIELDS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${FIELD_IMAGES_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${OCCUPATIONS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${OCCUPATIONS_IMAGES_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${SCHOOLS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${PROGRAMS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${EMPLOYERS} d5cedv3sq38d55

