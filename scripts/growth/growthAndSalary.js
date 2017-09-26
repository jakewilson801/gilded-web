var parse = require('csv-parse');
var fs = require('fs');
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

var oesColumns = ['AREA',
  'ST',
  'STATE',
  'OCC_CODE',
  'OCC_TITLE',
  'OCC_GROUP',
  'TOT_EMP',
  'EMP_PRSE',
  'JOBS_1000',
  'LOC_Q',
  'H_MEAN',
  'A_MEAN',
  'MEAN_PRSE',
  'H_PCT10',
  'H_PCT25',
  'H_MEDIAN',
  'H_PCT75',
  'H_PCT90',
  'A_PCT10',
  'A_PCT25',
  'A_MEDIAN',
  'A_PCT75',
  'A_PCT90',
  'ANNUAL',
  'HOURLY'];

var growthMap = {};

var growthParser = parse({delimiter: ','}, function (err, data) {
  data.forEach(function (d) {
    if (socCodes.includes(d[1]))
      growthMap[d[1]] = d[8];
  });
});

var socParser = parse({delimiter: ','}, function (err, data) {
  data.forEach(function (d) {
    if (socCodes.includes(d[3]) && d[1] === 'UT') {
      var insert = `insert into gilded_public.occupations(field_id, soc_detailed_id, soc_detailed_name, title, hourly_mean, annual_mean, project_growth_2024, hourly_pct10, hourly_pct25, hourly_median, hourly_pct75, hourly_pct90, annual_pct10, annual_pct25, annual_median, annual_pct75, annual_pct90)
       values('${d[3].split("-")[0]}', '${d[3].split("-")[1]}', '${d[4]}', '${d[4]}', ${d[oesColumns.indexOf('H_MEAN')]}, ${d[oesColumns.indexOf('A_MEAN')].replace(',', '')}, ${growthMap[d[3]]}, ${d[oesColumns.indexOf('H_PCT10')]}, ${d[oesColumns.indexOf('H_PCT25')]}, ${d[oesColumns.indexOf('H_MEDIAN')]}, ${d[oesColumns.indexOf('H_PCT75')]}, ${d[oesColumns.indexOf('H_PCT90')]}, ${d[oesColumns.indexOf('A_PCT10')].replace(',', '')}, ${d[oesColumns.indexOf('A_PCT25')].replace(',', '')}, ${d[oesColumns.indexOf('A_MEDIAN')].replace(',', '')}, ${d[oesColumns.indexOf('A_PCT75')].replace(',', '')}, ${d[oesColumns.indexOf('A_PCT90')].replace(',', '')});`
      console.log(insert);
    }
  });
});

fs.createReadStream(__dirname + '/growth.csv').pipe(growthParser);
fs.createReadStream(__dirname + '/state_M2016_dl.csv').pipe(socParser);