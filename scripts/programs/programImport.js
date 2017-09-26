var parse = require('csv-parse');
var fs = require('fs');

var columns = ["School ID", "Name", "Cost", "Months", "Creds", "OccupationIDs", "Flexible", "Link"];

var credMap = {1: "Bachelor''s", 2: "Associate''s", 3: "Certificate"};

var socCodes =
  ["15-1134",
    "15-1141",
    "15-1142",
    "15-1143",
    "15-1151",
    "15-1152",
    "17-3021",
    "17-3022",
    "17-3023",
    "17-3024",
    "17-3025",
    "17-3026",
    "17-3027",
    "17-3029",
    "29-1124",
    "29-1126",
    "29-1141",
    "29-2011",
    "29-2012",
    "29-2021",
    "29-2031",
    "29-2032",
    "29-2033",
    "29-2034",
    "29-2035",
    "29-2041",
    "29-2052",
    "29-2053",
    "29-2054",
    "29-2055",
    "29-2056",
    "29-2057",
    "29-2061",
    "29-2071",
    "29-2081",
    "29-2092",
    "47-2011",
    "47-2021",
    "47-2022",
    "47-2031",
    "47-2111",
    "47-2152",
    "49-3021",
    "49-3022",
    "49-3023",
    "49-3031",
    "49-3041",
    "49-9021",
    "49-9041",
    "49-9044",
    "49-9071",
    "49-9081",
    "51-4011",
    "51-4012",
    "51-4041",
    "51-4121",
    "29-2051",
    "17-3011",
    "51-2092"];

// create table if not exists gilded_public.Programs(
//   id    serial primary key,
//   school_id integer not null references gilded_public.Schools(id),
//   title text not null,
//   cost_in_state decimal(12,2) not null,
//   length_months integer not null,
//   flexible_schedule boolean not null,
//   credential credential not null
// );
//
// create table if not exists gilded_public.OccupationPrograms(
//   id serial primary key,
//   field_id integer not null references gilded_public.occupations(field_id),
//   soc_id integer not null references gilded_public.occupations(soc_detailed_id),
//   program_id integer not null references gilded_public.programs(id)
// );

let programsParser = parse({delimiter: '\t'}, function (err, data) {
  data.forEach(function (d) {
    let currency = d[columns.indexOf('Cost')];
    let tuition = Number(currency.replace(/[^0-9-]+/g, ""));
    let isFlexible = d[columns.indexOf('Flexible')] === 'y';
    let cred = credMap[d[columns.indexOf('Creds')]];
    let insert = `values (${d[columns.indexOf('School ID')]},'${d[columns.indexOf('Name')]}', ${tuition}, ${d[columns.indexOf('Months')]}, ${isFlexible ? "TRUE" : "FALSE"}, '${cred}');`;
    console.log(`insert into gilded_public.programs(school_id, title, cost_in_state, length_months, flexible_schedule, credential) ${insert}`);
    let programSocCodes = d[columns.indexOf('OccupationIDs')];
    if (programSocCodes.includes(',')) {
      programSocCodes.split(',').forEach(c => {
        if (socCodes.includes(c)) {
          let field = c.split("-")[0];
          let soc = c.split("-")[1];
          console.log(`insert into gilded_public.occupationprograms(field_id, soc_id, program_id) values(${field}, ${soc}, (SELECT currval('gilded_public.programs_id_seq')));`);
        }
      });
    } else {
      if (socCodes.includes(programSocCodes)) {
        let field = programSocCodes.split("-")[0];
        let soc = programSocCodes.split("-")[1];
        console.log(`insert into gilded_public.occupationprograms(field_id, soc_id, program_id) values(${field}, ${soc}, (SELECT currval('gilded_public.programs_id_seq')));`);
      }
    }
  });
});
// create table if not exists gilded_public.OccupationPrograms(
//   id serial primary key,
//   field_id integer not null,
//   soc_id integer not null,
//   foreign key (field_id, soc_id) references gilded_public.occupations(field_id, soc_detailed_id),
//   program_id integer not null references gilded_public.programs(id)
// );

fs.createReadStream(__dirname + '/programs.tsv').pipe(programsParser);