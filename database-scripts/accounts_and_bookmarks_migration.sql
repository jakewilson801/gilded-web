alter table gilded_private.accounts add column created_at timestamptz NOT NULL DEFAULT now();

create table if not exists gilded_private.ProgramBookmarks(
  id serial primary key,
  user_id integer not null references gilded_private.Accounts(id),
  program_id integer not null references gilded_public.Programs(id)
);

create table if not exists gilded_private.EmployerBookmarks(
  id serial primary key,
  user_id integer not null references gilded_private.Accounts(id),
  employer_id integer not null references gilded_public.Employers(id)
);