CREATE EXTENSION if not exists postgis;
CREATE SCHEMA if not exists gilded_public;
CREATE SCHEMA if not exists gilded_private;

drop table if exists gilded_public.Occupations CASCADE;
drop table if exists gilded_public.Schools CASCADE;
drop table if exists gilded_public.Programs CASCADE;

drop table if exists gilded_public.Fields CASCADE;
drop table if exists gilded_public.Employers CASCADE;
drop table if exists gilded_public.SchoolProgramLocations CASCADE;

drop table if exists gilded_public.SchoolLocations CASCADE;
drop table if exists gilded_public.EmployerLocations CASCADE;
drop table if exists gilded_public.ProgramCredentials CASCADE;
drop table if exists gilded_public.SchoolType CASCADE;
drop table if exists gilded_public.SchoolCampusSetting CASCADE;
drop table if exists gilded_public.EmployerBenefits CASCADE;
drop table if exists gilded_public.EmployerPositions CASCADE;
drop table if exists gilded_public.OccupationPrograms CASCADE;
drop table if exists gilded_private.Accounts CASCADE;
drop table if exists gilded_public.bls_series CASCADE;

drop type if exists seasonal_adjustment_type;
drop type if exists area_type_type;
drop type if exists datatype_type;

create table if not exists gilded_public.Fields(
  title text not null,
  image_url text,
  soc_major_id integer primary key,
  soc_major_name text not null
);

create table if not exists gilded_public.Occupations(
  id    serial primary key,
  field_id integer not null references gilded_public.Fields(soc_major_id),
  soc_detailed_id integer,
  soc_detailed_name text,
  title text not null,
  image_avatar_url text,
  video_url text,
  hourly_mean decimal (12, 2) not null,
  annual_mean integer not null,
  project_growth_2024 decimal(12, 2) not null,
  hourly_pct10 decimal(12, 2) not null,
  hourly_pct25 decimal(12, 2) not null,
  hourly_median decimal(12, 2) not null,
  hourly_pct75 decimal(12, 2) not null,
  hourly_pct90 decimal(12, 2) not null,
  annual_pct10 decimal(12, 2) not null,
  annual_pct25 decimal(12, 2) not null,
  annual_median decimal(12, 2) not null,
  annual_pct75 decimal(12, 2) not null,
  annual_pct90 decimal(12, 2) not null
);


create table if not exists gilded_public.SchoolType(
  id serial primary key,
  title text
 );


create table if not exists gilded_public.SchoolCampusSetting(
  id serial primary key,
  title text
);

create table if not exists gilded_public.Schools(
  id    serial primary key,
  title text not null,
  image_avatar_url text not null,
  image_background_url text,
  phone text not null,
  website_url text not null,
  school_type integer not null references gilded_public.SchoolType(id),
  school_campus_setting integer not null references gilded_public.SchoolCampusSetting(id),
  ipeds_id integer,
  ope_id integer,
  campus_housing boolean not null,
  address text,
  student_population text,
  student_faculty_ratio text
);

create table if not exists gilded_public.Employers(
  id    serial primary key,
  title text not null,
  image_avatar_url text not null,
  image_background_url text,
  phone text,
  about text,
  address text
);

create table if not exists gilded_public.EmployerBenefits(
  id serial primary key,
  title text,
  medical boolean,
  dental boolean,
  vision boolean,
  retirement_account boolean,
  vacation_days integer,
  on_the_job_training boolean,
  tuition_reimbursement boolean,
  additional_details text
);

create table if not exists gilded_public.EmployerPositions(
  id    serial primary key,
  benefits_id integer references gilded_public.EmployerBenefits(id),
  occupation_id integer references gilded_public.Occupations(id),
  employer_id integer references gilded_public.Employers(id),
  additional_details text
);

create table if not exists gilded_public.ProgramCredentials(
  id serial primary key,
  title text);

create table if not exists gilded_public.Programs(
  id    serial primary key,
  title text not null,
  cost_in_state decimal(12,2) not null,
  cost_out_state decimal(12,2),
  length integer not null,
  enrollment_open boolean not null,
  enrollment_fall boolean not null,
  enrollment_spring boolean not null,
  schedule_day boolean not null,
  schedule_evening boolean not null,
  schedule_weekend boolean not null,
  credential_id integer not null references gilded_public.ProgramCredentials(id),
  placement integer
);

create table if not exists gilded_public.OccupationPrograms(
  occupation_id integer not null references gilded_public.Occupations(id),
  program_id integer not null references gilded_public.Programs,
  primary key(occupation_id, program_id)
);

create table if not exists gilded_public.SchoolLocations(
  id    serial primary key,
  school_id integer not null references gilded_public.Schools(id),
  title text not null,
  location_info geometry not null);

create table if not exists gilded_public.EmployerLocations(
  id    serial primary key,
  employer_id integer not null references gilded_public.Employers(id),
  title text not null,
  location_info geometry not null);

create table if not exists gilded_public.SchoolProgramLocations(
  program_id integer not null references gilded_public.Programs(id),
  school_location_id integer not null references gilded_public.SchoolLocations(id),
  primary key(program_id, school_location_id)
);

create table if not exists gilded_private.Accounts(
  id serial primary key,
  full_name text,
  email text,
  avatar_url text,
  fb_user_id text,
  account_fb_info json
);

create type seasonal_adjustment_type as enum ('S','U');
create type area_type_type as enum ('M','N','S');
create type datatype_type as enum ('01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17');
create table if not exists gilded_public.bls_series(
  id serial primary key,
  series_type varchar(2) not null,
  seasonal_adjustment varchar(1) not null,
  area_type area_type_type not null,
  area_code varchar(7) not null,
  industry_code varchar(6) not null,
  occupation_code varchar(6) not null,
  datatype datatype_type not null,
  data_year integer not null,
  fetch_time timestamp not null default CURRENT_TIMESTAMP
);

insert into gilded_public.ProgramCredentials(title) values ('Certificate');
insert into gilded_public.ProgramCredentials(title) values ('Associate''s');
insert into gilded_public.ProgramCredentials(title) values ('Bachelor''s');

insert into gilded_public.SchoolCampusSetting(title) values ('Suburb: Large');
insert into gilded_public.SchoolCampusSetting(title) values ('City: Small');
insert into gilded_public.SchoolCampusSetting(title) values ('Town: Remote');
insert into gilded_public.SchoolCampusSetting(title) values ('Rural: Fringe');

insert into gilded_public.SchoolType(title) values('2-year, Public');
insert into gilded_public.SchoolType(title) values('<2-year, Public');
insert into gilded_public.SchoolType(title) values('4-year, Public');

-- insert into gilded_public.Fields(title, image_url, soc_major_id, soc_major_name) values ('Advanced Manufacturing', '/assets/advanced_manufacturing.png', 51, 'Production');
-- insert from fields.sql
-- insert from occupations.sql

--update gilded_public.occupations set (image_avatar_url, description, projected_growth, growth_ratio, hourly_median_wage, hourly_top_wage, top_paying_industry, video_url) = ('/assets/cnc_machining.png', 'Produces machined parts by programming, setting up, and operating a computer numerical control (CNC) machine; maintaining quality and safety standards; keeping records; maintaining equipment and supplies.', 17.5, 2.7, 18.21, 27.76, 'Scientific Research and Development Services', 'https://www.youtube.com/watch?v=pZ-kkiWj3i8') where field_id = 51 and soc_detailed_id=4011;
--update gilded_public.occupations set (image_avatar_url, description, projected_growth, growth_ratio, hourly_median_wage, hourly_top_wage, top_paying_industry, video_url) = ('/assets/cnc_machining.png', 'CNC programmers work as part of a team and are expected to interact regularly with clients to determine their needs and ensure the component manufactured meets expectations. CNC programmers usually work a standard 40-hour workweek, but may be expected to travel to factories if their offices are off-site. Since CNC pro grammers spend most of their time interacting with computers, they usually work in a clean, well-lit, ventilated, temperature-controlled environment. However, as they are expected to visit factories to ensure their programs are working correctly, they may find themselves in less controlled conditions.', 18.9, 2.9, 24.32, 37.86, 'Aerospace', 'https://www.youtube.com/watch?v=0uD6INGRnTE') where field_id = 51 and soc_detailed_id=4012;
--update gilded_public.occupations set (image_avatar_url, description, projected_growth, growth_ratio, hourly_median_wage, hourly_top_wage, top_paying_industry, video_url) = ('/assets/machinist.png', 'Manual machinists are skilled, dexterous individuals who drill, cut and shape items both manually and with machine tools. Working in industrial shops or plants with blueprints and specifications, machinists produce anything from bed springs to auto parts.', 9.8, 1.5, 20.05, 30.09, 'Natural Gas Distribution', 'https://www.youtube.com/watch?v=TecC9_nwpUw') where field_id = 51 and soc_detailed_id=4041;
--update gilded_public.occupations set (image_avatar_url, description, projected_growth, growth_ratio, hourly_median_wage, hourly_top_wage, top_paying_industry, video_url) = ('/assets/welding.png', 'Welding is a method of permanently joining two or more metal parts. Welding involves applying heat to metal pieces which melts and fuses them, creating a strong bond upon cooling. Welders use many different welding methods for specific purposes including maintenance and repair. Given the importance of welding as an industrial process, it is not surprising that welders are employed across a broad range of industries, including construction, car racing, oil and gas, mining, and manufacturing.', 3.6, 0.6, 18.94, 29.85, 'Electric Power Generation, Transmission and Distribution', 'https://www.youtube.com/watch?v=rlOEBAIkmwg') where field_id = 51 and soc_detailed_id=4121;

insert into gilded_public.Schools(title, image_avatar_url, image_background_url, phone, website_url, school_type, school_campus_setting, ipeds_id, ope_id, campus_housing) values ('Davis Applied Technology College', '/assets/datc.jpg', '/assets/datc_rotunda.png', '(801) 593-2500', 'www.datc.edu', 1, 1, 230162, 2156600, false);

insert into gilded_public.Schoollocations(school_id, title, location_info) values(1, 'Davis Campus', ST_GeomFromText('POINT(41.0284302 -111.9258624)', 4326));
insert into gilded_public.Schoollocations(school_id, title, location_info) values(1, 'Kaysville Campus', ST_GeomFromText('POINT(41.0284302 -111.9258624)', 4326));

insert into gilded_public.Programs(title, cost_in_state, length, enrollment_open, enrollment_fall, enrollment_spring, schedule_day, schedule_evening, schedule_weekend, credential_id) values ('CNC Machining', 5281, 13, true, false, false, true, true, false, 1);
insert into gilded_public.Programs(title, cost_in_state, length, enrollment_open, enrollment_fall, enrollment_spring, schedule_day, schedule_evening, schedule_weekend, credential_id) values ('Composite Materials Technology', 3296, 12, true, false, false, true, true, false, 1);

insert into gilded_public.SchoolProgramLocations(program_id, school_location_id) values (1, 1);
insert into gilded_public.SchoolProgramLocations(program_id, school_location_id) values (2, 1);

--insert into gilded_public.OccupationPrograms(occupation_id, program_id) values (1, 1);

insert into gilded_public.Employers(title, image_avatar_url, image_background_url, phone, address, about) values ('Orbital ATK', 'https://www.orbitalatk.com/images/logo.png', 'https://www.orbitalatk.com/flight-systems/aerospace-structures/commercial-aircraft-structures/images/banner_commercialair.jpg', '435-863-3511', 'Freeport Center Building H-8 Clearfield UT 84016', 'As a global leader in aerospace and defense technologies, Orbital ATK designs, builds and delivers space, defense and aviation-related systems to customers around the world both as a prime contractor and as a merchant supplier. Our main products include launch vehicles and related propulsion systems; satellites and associated components and services; composite aerospace structures; tactical missiles, subsystems and defense electronics; and precision weapons, armament systems and ammunition.');

insert into gilded_public.EmployerBenefits(title, medical, dental, vision, retirement_account, vacation_days, on_the_job_training, tuition_reimbursement) values('Full time employee', true, true, true, true, 14, true, true);

--insert into gilded_public.EmployerPositions(benefits_id, occupation_id, employer_id) values(1, 1, 1);
-- how to query on distance
--SELECT ST_Distance_Sphere(ST_GeomFromText('POINT(41.0284302 -111.9258624)',4326), ST_GeomFromText('POINT(41.038144 -111.93864
--        7)',4326));
