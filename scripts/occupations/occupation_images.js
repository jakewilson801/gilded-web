var parse = require('csv-parse');
var fs = require('fs');
var indexes = ['SOC Detailed Name',
  'SOC Major ID',
  'SOC Major Name',
  'SOC Major Lay Title',
  'SOC Detailed ID',
  'SOC Detailed Name',
  'media search assn',
  'image file',
  'Video'];

var imageParser = parse({delimiter: '\t'}, function (err, data) {
  data.forEach(function (d) {
    var statement = `update gilded_public.occupations set image_avatar_url = '/assets/${d[indexes.indexOf('image file')]}', video_url = '${d[indexes.indexOf('Video')]}' where field_id = ${d[indexes.indexOf('SOC Major ID')]} and soc_detailed_id = ${d[indexes.indexOf('SOC Detailed ID')].split('-')[1]};`;
    console.log(statement);
  })
});


fs.createReadStream(__dirname + '/occupationImages.tsv').pipe(imageParser);