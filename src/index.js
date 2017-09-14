const express = require('express');
const path = require('path');
const massive = require('massive');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');

let connectionInfo = process.env.DATABASE_URL || {
  host: process.env.DATABASE_URL || '127.0.0.1',
  port: 5432,
  database: process.env.DB_NAME || 'gilded',
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || ''
};

massive(connectionInfo).then(instance => {
  app.set('db', instance);

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

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

  app.get('/api/v1/employers', (req, res) => {
    req.app.get('db').run('select * from gilded_public.employers').then(result => res.json(result));
  });

  app.get('/api/v1/schools', (req, res) => {
    req.app.get('db').run('select * from gilded_public.schools').then(result => res.json(result));
  });

  app.get('/api/v1/schools/:school_id/details', (req, res) => {
    let queries = [];
    queries.push(req.app.get('db').gilded_public.schools.findOne({id: req.params.school_id}));
    queries.push(req.app.get('db').gilded_public.schoollocations.find({school_id: req.params.school_id}));
    Promise.all(queries).then(values => {
      res.json(Object.assign({}, values[0], {school_locations: values[1]}));
    });
  });

  app.get('/api/v1/employers/:employer_id/details', (req, res) => {
    req.app.get('db').gilded_public.employers.findOne({id: req.params.employer_id}).then(values => {
      res.json(values)
    });
  });

  app.get('/api/v1/programs', (req, res) => {
    let schoolLocationIds = req.query.school_location_ids.split(',').map(location => parseInt(location));
    req.app.get('db').run('select programs.*, schoollocations.title as campus_name, schoollocations.id as school_location_id ' +
      'from gilded_public.schoolprogramlocations ' +
      'locations inner join gilded_public.programs programs on locations.program_id=programs.id ' +
      'inner join gilded_public.schoollocations on locations.school_location_id=gilded_public.schoollocations.id ' +
      'where school_location_id in (1,2)', schoolLocationIds).then(values => {
      res.json(schoolLocationIds.map(i => {
        let title = _.find(values, (o) => i === o.school_location_id).campus_name;
        let programs = _.filter(values, (o) => i === o.school_location_id);
        return {school_name: title, program_list: programs};
      }));
    });
  });

  app.post('/api/v1/accounts/facebook', (req, res) => {
    //TODO Implement FB sign up in DB
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Gilded on port: ${port}`);
});