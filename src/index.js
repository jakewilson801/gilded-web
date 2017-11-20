const express = require('express');
const path = require('path');
const massive = require('massive');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const morgan = require('morgan');
const request = require('request');
const JWT = require('jsonwebtoken');
const enforce = require('express-sslify');

let connectionInfo = process.env.DATABASE_URL || {
  host: process.env.DATABASE_URL || '127.0.0.1',
  port: 5432,
  database: process.env.DB_NAME || 'gilded',
  user: process.env.DB_USER || (process.platform === 'win32' ? 'postgres' : ''),
  password: process.env.DB_PASSWORD || (process.platform === 'win32' ? 'password' : '')
};

massive(connectionInfo).then(instance => {
  app.set('db', instance);
  if (process.env.NODE_ENV === 'production') {
    app.all(enforce.HTTPS());
  }
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  app.use(morgan('dev'));

  app.set('superSecret', '1337hackzors');

  app.get('/api/v1/fields', (req, res) => {
    req.app.get('db').run('select * from gilded_public.fields').then(result => res.json(result));
  });

  app.get('/api/v1/feed', (req, res) => {
    let t = req.query.tuition;
    let y = req.query.years === 0 ? 1 : req.query.years * 12;
    let s = req.query.salary;
    let query = `select distinct occs.* from gilded_public.programs progs, gilded_public.occupationprograms occMap, gilded_public.occupations occs where progs.cost_in_state <= $1 and progs.length_months <= $2 and occs.annual_mean >= $3 and occMap.field_id = occs.field_id and occMap.soc_id = occs.soc_detailed_id and progs.id = occMap.program_id order by occs.annual_mean desc;`;
    let queries = [];
    queries.push(req.app.get('db').run('select * from gilded_public.fields'));
    if (t && y && s) {
      queries.push(req.app.get('db').run(query, [t, y, s]));
    } else {
      queries.push(req.app.get('db').run('select * from gilded_public.occupations order by gilded_public.occupations.annual_mean desc'));
    }
    Promise.all(queries).then(values => res.json({
      fields: values[0],
      occupations: values[1]
    })).catch(error => console.log(error));
  });

  app.get('/api/v1/occupations/:field_id', (req, res) => {
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
  });

  app.get('/api/v1/occupations/:occupation_id/details', (req, res) => {
    req.app.get('db').gilded_public.occupations.findOne({id: req.params.occupation_id})
      .then(result => res.json(result));
  });

  app.get('/api/v1/schools', (req, res) => {
    if (req.query.socCode) {
      let ids = [];
      ids.push(req.query.socCode.split('-')[0]);
      ids.push(req.query.socCode.split('-')[1]);
      req.app.get('db').run(`select distinct schools.* from gilded_public.occupationprograms programsMap, gilded_public.programs programs, gilded_public.schools schools  where programsMap.program_id = programs.id and schools.id = programs.school_id and field_id =$1  and soc_id =$2;`, ids)
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
  });

  app.get('/api/v1/employers', (req, res) => {
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
  });

  app.get('/api/v1/employers/:employer_id/details', (req, res) => {
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
  });

  app.get('/api/v1/mercury', (req, res) => {
    if (req.query.url) {
      let options = {
        url: `https://mercury.postlight.com/parser?url=${req.query.url}`,
        headers: {
          'x-api-key': 'S79Q41Lw3H3S5JSgNT9Gztcz2zYwJBJtHGPUlKtK'
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
  });

  app.get('/api/v1/schools/:id/details/:school_id', (req, res) => {
    let ids = [];
    ids.push(req.params.id.split("-")[0]);
    ids.push(req.params.id.split("-")[1]);
    let queries = [];
    queries.push(req.app.get('db').gilded_public.schools.findOne({id: req.params.school_id}));
    queries.push(req.app.get('db').run('select * from gilded_public.occupationprograms programsMap, gilded_public.programs programs where programsMap.program_id = programs.id and programsMap.field_id = $1 and programsMap.soc_id = $2', ids));
    Promise.all(queries).then(values => {
      res.json(Object.assign({}, values[0], {programs: values[1]}));
    });
  });

  app.get('/api/v1/programs', (req, res) => {
    let ids = [];
    let socField = req.query.socCode.split('-')[0];
    let socDetail = req.query.socCode.split('-')[1];
    ids.push(socField);
    ids.push(socDetail);
    req.app.get('db').run('select p.title as program_title, p.length_months, p.cost_in_state, p.id as program_id , s.* from gilded_public.programs p, gilded_public.schools s where p.id in (select program_id from gilded_public.occupationprograms where field_id = $1 and soc_id = $2) and s.id in (select school_id from gilded_public.programs progs where progs.id = p.id);', ids)
      .then(result => {
        res.json(result);
      })
      .catch(error => error => {
        console.log(`ERROR ${error}`);
        res.status(400);
        res.send("BAD REQUEST");
      });
  });

  app.get('/api/v1/programs/:socCode/:school_id', (req, res) => {
    let ids = [];
    let socField = req.params.socCode.split('-')[0];
    let socDetail = req.params.socCode.split('-')[1];
    ids.push(socField);
    ids.push(socDetail);
    ids.push(req.params.school_id);
    req.app.get('db').run('select programs.* from gilded_public.occupationprograms programsMap, gilded_public.programs programs where programsMap.program_id = programs.id and programsMap.field_id = $1 and programsMap.soc_id = $2 and programs.school_id = $3', ids)
      .then(result => {
        res.json(result);
      })
      .catch(error => {
        console.log(`ERROR ${error}`);
        res.status(400);
        res.send("BAD REQUEST");
      });
  });

  app.post('/api/v1/accounts/facebook', (req, res) => {
    request(`https://graph.facebook.com/app?access_token=${req.body.accessToken}`, (error, response, body) => {
      let t = JWT.sign({
        data: {fb_token: req.body.accessToken, user_id: req.body.userID}
      }, app.get('superSecret'));
      if (!error) {
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

  });

  let authRoutes = express.Router();

  authRoutes.use((req, res, next) => {
    let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
    if (jwtToken) {
      JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
        if (err) {
          return res.status(401).json({success: false, message: 'Failed to authenticate token.'});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).send({
        success: false,
        message: 'No token provided.'
      });
    }
  });

  authRoutes.get('/me', (req, res) => {
    let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
    JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.status(401).send("Invalid auth");
      } else {
        req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => res.json(data));
      }
    });
  });

  authRoutes.post('/bookmarks', (req, res) => {
    let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
    JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.status(401).send({error: "Invalid auth"});
      } else {
        req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
          let values = [];
          values.push(data[0].id);
          values.push(req.body.occupation_id);
          req.app.get('db').run("select * from gilded_private.occupationbookmarks where user_id = $1 and occupation_id = $2", values).then(data => {
            if (data.length > 0) {
              req.app.get('db').run("delete from gilded_private.occupationbookmarks where user_id = $1 and occupation_id = $2", values).then(data => {
                res.status(202).send({message: "Successfully deleted"});
              }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
            } else {
              req.app.get('db').run("insert into gilded_private.occupationbookmarks(user_id, occupation_id) values ($1,$2)", values).then(data => {
                res.status(201).send({message: "Successfully created"});
              }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
            }
          });
        });
      }
    });
  });

  authRoutes.get('/bookmarks', (req, res) => {
    let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
    JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.status(401).send({error: "Invalid auth"});
      } else {
        req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
          let user_id = data[0].id;
          req.app.get('db').run("select * from gilded_public.occupations where id in (select occupation_id from gilded_private.occupationbookmarks where user_id = $1)", [user_id]).then(data => {
            res.json(data);
          });
        });
      }
    });
  });

  app.use('/api/v1/user', authRoutes);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Gilded on port: ${port}`);
});