var parse = require('csv-parse')
var https = require('https')
var async = require('async')

var BLS_URL = 'https://download.bls.gov/pub/time.series/oe/oe.industry'

function getIndustryCodes(cb) {
  return https.get(BLS_URL, function(res) {
    body = ''
    res.on('data', function(d) {
      body += d
    })
    res.on('end', function() {
      cb(body)
    })
  }).on('error', function(e) {
    console.error(e)
  })
}

function convertIndustryRecord(record) {
  var industry_name = record.industry_name.substring(record.industry_name.indexOf('-')+1).trim()
  var idx_name = industry_name.substring(0,4).toUpperCase()
  return {
    idx_name: idx_name,
    name: industry_name,
    code: record.industry_code
  }
}

getIndustryCodes(function(body) {
  parse(body, {delimiter: '\t', columns: true, relax_column_count: true}, function(err, records) {
    if (err) {
      console.error(err)
      return
    }
    console.log(`const INDUSTRIES = {`)
    records.forEach( function(record) {
      if (record.industry_code.indexOf('--') > -1) {
        var rec = convertIndustryRecord(record)
        console.log(`  ${rec.idx_name}: {name:'${rec.name}', code: '${rec.code}'},`)
      }
    })
    console.log(`  NOOP: {}\n}`)
  })
})
