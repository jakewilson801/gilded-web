const express = require('express');
const path = require('path');
const massive = require('massive');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const morgan = require('morgan');
const request = require('request');

let connectionInfo = process.env.DATABASE_URL || {
  host: process.env.DATABASE_URL || '127.0.0.1',
  port: 5432,
  database: process.env.DB_NAME || 'gilded',
  user: process.env.DB_USER || (process.platform === 'win32' ? 'postgres' : ''),
  password: process.env.DB_PASSWORD || (process.platform === 'win32' ? 'password' : '')
};

massive(connectionInfo).then(instance => {
  app.set('db', instance);

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  app.use(morgan('dev'));

  app.get('/api/v1/fields', (req, res) => {
    req.app.get('db').run('select * from gilded_public.fields').then(result => res.json(result));
  });

  app.get('/api/v1/feed', (req, res) => {
    let queries = [];
    queries.push(req.app.get('db').run('select * from gilded_public.fields'));
    queries.push(req.app.get('db').run('select * from gilded_public.occupations'));
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
    req.app.get('db').gilded_public.employers.findOne({id: req.params.employer_id}).then(values => {
      res.json(values)
    });
  });


  // let headers = new Headers();
  // headers.append('x-api-key', 'S79Q41Lw3H3S5JSgNT9Gztcz2zYwJBJtHGPUlKtK');
  // fetch(``, headers).then(data => data.json()).then(json => console.log(json));
  app.get('/api/v1/mercury', (req, res) => {
    if (req.query.url) {
      var options = {
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
    req.app.get('db').run('select * from gilded_public.programs where id in (select program_id from gilded_public.occupationprograms where field_id = $1 and soc_id = $2)', ids)
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
      .catch(error => error => {
        console.log(`ERROR ${error}`);
        res.status(400);
        res.send("BAD REQUEST");
      });
  });

  app.post('/api/v1/accounts/facebook', (req, res) => {
    req.app.get('db').gilded_private.accounts.findOne({fb_user_id: req.body.userID}).then(values => {
      if (!values) {
        req.app.get('db').gilded_private.accounts.insert({
          full_name: req.body.name,
          email: req.body.email,
          avatar_url: req.body.picture.data.url,
          fb_user_id: req.body.userID,
          account_fb_info: req.body
        }).then(result => {
            res.status(201).send(result);
          }
        )
      } else {
        res.status(200).send("GTG");
      }
    });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Gilded on port: ${port}`);
});