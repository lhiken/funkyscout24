create table
  events (
    id int generated by default as identity,

    event    text    NOT NULL,
    date     date    NOT NULL,

    primary key (id)
  );

alter table events
add constraint unique_event unique (event);

alter table events
add constraint unique_date unique (date);

create table
  users (
    id int generated by default as identity,

    name     text    NOT NULL,
    event    text    NOT NULL,
    matches  int     NOT NULL,
    
    primary key (id, event)
  )
partition by list (event);

create table
  event_data (
    event    text    NOT NULL,
    match    int     NOT NULL,
    team     int     NOT NULL,
    alliance boolean NOT NULL,
    author   text,

    primary key (event, match, team)
  )
partition by list (event);

create table
  match_data (
    -- Match information --
    event    text    NOT NULL, --i.e. 2024cacg
    match    int     NOT NULL, --i.e. 1, 2, 32
    team     int     NOT NULL, --i.e. 846, 254
    alliance boolean NOT NULL, --True: BLUE, False: RED

    -- Match performance data --
    auto     jsonb   NOT NULL, --Auto path data in JSON
    miss     int     NOT NULL, --Missed shots of any kind
    amp      int     NOT NULL, --Successful amp shots
    speaker  int     NOT NULL, --Successful speaker shots

    climb    boolean NOT NULL, --T/F based on climb success
    defense  int     NOT NULL, --Time played defense, in ms
    disabled int     NOT NULL, --Time disabled, in ms

    -- Other match data --
    comment  text    NOT NULL,
    author   text    NOT NULL,

    primary key (event, match, team)
  )
partition by list (event);

create table
  team_data (
    -- Team information --
    event    text    NOT NULL, --i.e. 2024cacg
    team     int     NOT NULL, --i.e. 846, 254

    -- Performance data --
    avg_score   int  NOT NULL,
    avg_amp     int  NOT NULL,
    avg_speaker int  NOT NULL,
    failures    int  NOT NULL,
    defense     int  NOT NULL,

    primary key (event, team)
  )
partition by list (event);

create table if not exists
  users_2024idbo partition of users for
values
  in ('2024idbo');

alter table users_2024idbo
add constraint unique_2024idbo_users unique (name);

alter table users_2024idbo
add constraint fk_event foreign key (event) references events (event);

create table if not exists
  teams_2024idbo partition of team_data for
values
  in ('2024idbo');

alter table teams_2024idbo
add constraint unique_2024idbo_teams unique (team);

alter table teams_2024idbo
add constraint fk_event foreign key (event) references events (event);

create table if not exists
  event_2024idbo partition of event_data for
values
  in ('2024idbo');

alter table event_2024idbo
add constraint fk_teams foreign key (team) references teams_2024idbo (team);

alter table event_2024idbo
add constraint fk_author foreign key (author) references users_2024idbo (name);

alter table event_2024idbo
add constraint fk_event foreign key (event) references events (event);

create table if not exists
  matches_2024idbo partition of match_data for
values
  in ('2024idbo');

alter table matches_2024idbo
add constraint fk_match foreign key (event, match, team) references event_2024idbo (event, match, team);

alter table events enable row level security;

alter table users_2024idbo enable row level security;
alter table teams_2024idbo enable row level security;
alter table event_2024idbo enable row level security;
alter table matches_2024idbo enable row level security;

create policy anon_read on events for
select
  using (true);

create policy anon_read on users_2024idbo for
select
  using (true);

create policy anon_read on teams_2024idbo for
select
  using (true);

create policy anon_read on event_2024idbo for
select
  using (true);

create policy anon_read on matches_2024idbo for
select
  using (true);
