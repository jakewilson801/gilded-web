const JWT = require('jsonwebtoken');
const interests = require('../constants/PersonalityFilters');

const feed = (req, res) => {
  let {tuition, years, salary, interest} = req.query;
  years = req.query.years * 12;
  let query = `select distinct occs.* from gilded_public.programs progs, gilded_public.occupationprograms occMap, gilded_public.occupations occs where progs.cost_in_state <= $1 and progs.length_months <= $2 and occs.annual_mean >= $3 and occMap.field_id = occs.field_id and occMap.soc_id = occs.soc_detailed_id and progs.id = occMap.program_id order by occs.annual_mean desc;`;
  if (tuition || years || salary || interest) {
    if (parseInt(interest) === -1) {
      req.app.get('db').run(query, [tuition, years, salary]).then(data => res.json({occupations: data}));
    } else {
      let socInterestBasedCodes = interests.getInterestById(interest);
      req.app.get('db').run(query, [tuition, years, salary]).then(data => {
        res.json({occupations: data.filter(d => socInterestBasedCodes.includes(`${d.field_id}-${d.soc_detailed_id}`))});
      });
    }
  } else {
    req.app.get('db').run('select * from gilded_public.occupations order by gilded_public.occupations.annual_mean desc').then(data => res.json({occupations: data}));
  }
};

const fields = (req, res) => {
  req.app.get('db').run('select * from gilded_public.fields').then(result => res.json(result));
};

const occupationByFieldID = (req, res) => {
  let queries = [];
  queries.push(req.app.get('db').run('select * from gilded_public.occupations where field_id = $1', [req.params.field_id]));
  queries.push(req.app.get('db').gilded_public.fields.findOne({soc_major_id: req.params.field_id}));
  Promise.all(queries).then(values => {
    let occupations = values[0];
    let field = values[1];
    if (occupations && occupations.length > 0 && field) {
      res.json({occupations: occupations, field: field});
    } else {
      res.status(404).send('Not Found')
    }
  });
};

const occupation = (req, res) => {
  req.app.get('db').gilded_public.occupations.findOne({id: req.params.occupation_id})
    .then(result => res.json(result));
};

const schoolsById = (req, res) => {
  if (req.params.school_id) {
    let id = [req.params.school_id];
    req.app.get('db').run(`select * from gilded_public.schools where id = $1`, id)
      .then(result => {
        if (result) {
          res.json(result);
        } else {
          res.status(404);
          res.send("Couldn't find a school sorry");
        }
      }).catch(error => {
      console.log(error);
      res.status(400);
      res.send("ERROR");
    });
  }
};

const employersBySocCode = (req, res) => {
  if (req.query.socCode) {
    let ids = [];
    ids.push(req.query.socCode.split('-')[0]);
    ids.push(req.query.socCode.split('-')[1]);
    let query = `select distinct employers.* from gilded_public.employeroccupations employersMap, gilded_public.employers employers where employersMap.employer_id = employers.id and field_id =$1  and soc_id =$2;`;
    req.app.get('db').run(query, ids).then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404);
        res.send("Couldn't find an employer based on that id sorry!");
      }
    }).catch(error => {
      console.log(error);
      res.status(400);
      res.send("ERROR");
    });
  }
};

const employerDetails = (req, res) => {
  let queries = [];
  queries.push(req.app.get('db').run(`select occs.* from gilded_public.occupations occs where (CONCAT(occs.field_id , '-' , occs.soc_detailed_id)) in (SELECT CONCAT(empMap.field_id, '-' , empMap.soc_id) from gilded_public.employeroccupations empMap where empMap.employer_id = $1)`, req.params.employer_id));
  queries.push(req.app.get('db').gilded_public.employers.findOne({id: req.params.employer_id}));
  Promise.all(queries).then(data => {
    if (data[1] && data[0]) {
      res.json({employer: data[1], occupations: data[0]});
    } else {
      res.status(404);
      res.send("Whoops didn't find that employer");
    }
  }).catch(error => {
    console.log(error);
    res.status(400);
    res.send("ERROR");
  });
};

const mecuryContentParser = (req, res) => {
  if (req.query.url) {
    let options = {
      url: `https://mercury.postlight.com/parser?url=${req.query.url}`,
      headers: {
        'x-api-key': ''
      }
    };
    request(options, function (error, response, body) {
      if (error !== null) {
        res.status(400);
        res.send("Couldnt find the summary");
      } else {
        res.json(response);
      }
    });
  } else {
    res.json({});
  }
};

const programsBySchoolID = (req, res) => {
  let ids = [];
  ids.push(req.params.id.split("-")[0]);
  ids.push(req.params.id.split("-")[1]);
  let queries = [];
  queries.push(req.app.get('db').gilded_public.schools.findOne({id: req.params.school_id}));
  queries.push(req.app.get('db').run('select * from gilded_public.occupationprograms programsMap, gilded_public.programs programs where programsMap.program_id = programs.id and programsMap.field_id = $1 and programsMap.soc_id = $2', ids));
  Promise.all(queries).then(values => {
    res.json(Object.assign({}, values[0], {programs: values[1]}));
  });
};

const programsBySocCode = (req, res) => {
  let ids = [];
  let socField = req.query.socCode.split('-')[0];
  let socDetail = req.query.socCode.split('-')[1];
  ids.push(socField);
  ids.push(socDetail);
  req.app.get('db').run('select p.title as program_title, p.length_months, p.cost_in_state, p.id as program_id , s.* from gilded_public.programs p, gilded_public.schools s where p.id in (select program_id from gilded_public.occupationprograms where field_id = $1 and soc_id = $2) and s.id in (select school_id from gilded_public.programs progs where progs.id = p.id);', ids)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.log(`ERROR ${error}`);
      res.status(400);
      res.send("BAD REQUEST");
    });
};

const programs = (req, res) => {
  let id = [req.params.program_id];
  req.app.get('db').run('select * from gilded_public.programs where id = $1', id)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      console.log(`ERROR ${error}`);
      res.status(400);
      res.send("BAD REQUEST");
    });
};

const request = require('request');

let facebookSignUp = (app) => (req, res) => {
  request(`https://graph.facebook.com/me?access_token=${req.body.accessToken}`, (error, response, body) => {
    let parsedResponse = JSON.parse(body);
    if (!error && parsedResponse.id && parsedResponse.id === req.body.userID) {
      let t = JWT.sign({
        data: {fb_token: req.body.accessToken, user_id: req.body.userID}
      }, app.get('superSecret'));
      req.app.get('db').gilded_private.accounts.findOne({fb_user_id: req.body.userID}).then(values => {
        if (!values) {
          req.app.get('db').gilded_private.accounts.insert({
            full_name: req.body.name,
            email: req.body.email,
            avatar_url: req.body.picture.data.url,
            fb_user_id: req.body.userID,
            account_fb_info: req.body
          }).then(r => {
              res.status(201).send({token: t, result: r});
            }
          )
        } else {
          res.status(200).send({token: t});
        }
      });
    } else {
      res.status(400).send("Upgrade your honda");
    }
  });
};

module.exports = {
  feed: feed,
  fields: fields,
  occupationByFieldID: occupationByFieldID,
  occupation: occupation,
  schoolsById: schoolsById,
  employersBySocCode: employersBySocCode,
  employerDetails: employerDetails,
  mecuryContentParser: mecuryContentParser,
  programsBySchoolID: programsBySchoolID,
  programsBySocCode: programsBySocCode,
  programs: programs,
  facebookSignup: facebookSignUp
};










