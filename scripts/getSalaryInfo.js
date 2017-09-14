const MAX_QUERIES = 500
const MAX_SERIES_PER_QUERY = 50
const MAX_YEARS_PER_QUERY = 20

const AREACODES = {
  NATIONAL: {name: 'National', type: 'N', code: '0000000'},
  UTAH: {name: 'Utah', type: 'S', code: '4900000'},
  LOGAN: {name: 'Logan', type: 'M', code: '0030860'}, // Logan, UT-ID
  OGDEN: {name: 'Ogden-Clearfield', type: 'M', code: '0036260'}, // Ogden-Clearfield, UT
  PROVO: {name: 'Provo-Orem', type: 'M', code: '0039340'}, // Provo-Orem, UT
  STGEORGE: {name: 'St. George', type: 'M', code: '0041100'},
  SLC: {name: 'Salt Lake City', type: 'M', code: '0041620'},
  WASATCH: {name: 'Wasatch Back', type: 'M', code: '4900001'},
  CENTRAL: {name: 'Central Utah', type: 'M', code: '4900002'},
  SOUTHWEST: {name: 'Southwest Utah', type: 'M', code: '4900003'},
  EASTERN: {name: 'Eastern Utah', type: 'M', code: '4900004'}
}

const INDUSTRIES = {
  AGRI: {name:'Agriculture, Forestry, Fishing and Hunting', code: '11--12'},
  MINI: {name:'Mining', code: '21--22'},
  UTIL: {name:'Utilities', code: '22--23'},
  CONS: {name:'Construction', code: '23--24'},
  MANU: {name:'Manufacturing', code: '31--34'},
  WHOL: {name:'Wholesale Trade', code: '42--43'},
  RETA: {name:'Retail Trade', code: '44--46'},
  TRAN: {name:'Transportation and Warehousing', code: '48--50'},
  INFO: {name:'Information', code: '51--52'},
  FINA: {name:'Finance and Insurance', code: '52--53'},
  REAL: {name:'Real Estate and Rental and Leasing', code: '53--54'},
  PROF: {name:'Professional, Scientific, and Technical Services', code: '54--55'},
  MANA: {name:'Management of Companies and Enterprises', code: '55--56'},
  ADMI: {name:'Administrative and Support and Waste Management and Remediation Services', code: '56--57'},
  EDUC: {name:'Educational Services', code: '61--62'},
  HEAL: {name:'Health Care and Social Assistance', code: '62--63'},
  ARTS: {name:'Arts, Entertainment, and Recreation', code: '71--72'},
  ACCO: {name:'Accommodation and Food Services', code: '72--73'},
  OTHE: {name:'Other Services (except Federal, State, and Local Government)', code: '81--82'},
  NOOP: {}
}

const DATA_TYPES = {
  EMPL: {code:'01', name:'Employment'},
  EPRS: {code:'02', name:'Employment percent relative standard error'},
  HMNW: {code:'03', name:'Hourly mean wage'},
  AMNW: {code:'04', name:'Annual mean wage'},
  WPRS: {code:'05', name:'Wage percent relative standard error'},
  H10W: {code:'06', name:'Hourly 10th percentile wage'},
  H25W: {code:'07', name:'Hourly 25th percentile wage'},
  HMDW: {code:'08', name:'Hourly median wage'},
  H75W: {code:'09', name:'Hourly 75th percentile wage'},
  H90W: {code:'10', name:'Hourly 90th percentile wage'},
  A10W: {code:'11', name:'Annual 10th percentile wage'},
  A25W: {code:'12', name:'Annual 25th percentile wage'},
  AMDW: {code:'13', name:'Annual median wage'},
  A75W: {code:'14', name:'Annual 75th percentile wage'},
  A90W: {code:'15', name:'Annual 90th percentile wage'},
  EPKJ: {code:'16', name:'Employment per 1,000 jobs'},
  LOCQ: {code:'17', name:'Location Quotient'}
}

class BLSTimeSeries {
  constructor (area, industry, occupation_code, data_type) {
    this.prefix = "OE"; // Occupational Employment
    this.seasonalAdjustment = "U"; // Unadjusted or Seasonally adjusted
    this.areaType = area.type; // National, State, or Metropolitan
    this.areaCode = area.code; // from AREACODES
    this.industryCode = industry.code; // from industry codes
    this.occupationCode = occupation_code;
    this.dataTypeCode = data_type.code; // from DATA_TYPES
  }
}
BLSTimeSeries.prototype.code = function() {
  return `${this.prefix}${this.seasonalAdjustment}${this.areaType}${this.industryCode}${this.occupationCode}${this.dataTypeCode}`
}


var oeAnnualMeanForAll = new BLSTimeSeries(AREACODES.NATIONAL, INDUSTRIES.REAL, '000000', DATA_TYPES.AMNW)
console.log(oeAnnualMeanForAll.code())
