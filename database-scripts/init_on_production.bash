#!/usr/bin/env bash
FIELDS_SCRIPT=fields.sql
FIELD_IMAGES_SCRIPT=fieldImages.sql
OCCUPATIONS_SCRIPT=occupations.sql
OCCUPATIONS_IMAGES_SCRIPT=occupationImages.sql
INIT_SCRIPT=init.sql

if [ ! -f ${INIT_SCRIPT} ]; then
  FIELDS_SCRIPT=database-scripts/fields.sql
  FIELD_IMAGES_SCRIPT=database-scripts/fieldImages.sql
  OCCUPATIONS_SCRIPT=database-scripts/occupations.sql
  OCCUPATIONS_IMAGES_SCRIPT=database-scripts/occupationImages.sql
  INIT_SCRIPT=database-scripts/init.sql
fi

psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${INIT_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${FIELDS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${FIELD_IMAGES_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${OCCUPATIONS_SCRIPT} d5cedv3sq38d55
psql postgres://gknkukyparucvq:ba78c3f16fa4ef2b3f4a38fef55392a196c3611df973cfc91c4aeeb8f17f6733@ec2-50-17-236-15.compute-1.amazonaws.com:5432/d5cedv3sq38d55 -f ${OCCUPATIONS_IMAGES_SCRIPT} d5cedv3sq38d55

