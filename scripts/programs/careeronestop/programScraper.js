const request = require('request');
const cheerio = require('cheerio');

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


socCodes.forEach(function (d) {
  let url = `https://www.careeronestop.org/Credentials/Toolkit/find-local-training.aspx?keyword=${d}&location=Utah&ajax=0&post=y`;
  request(url, function (error, response, body) {
    let table = 'res-table';
    let error = 'divError';
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body);
  });
});