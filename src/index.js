const express = require('express');
const path = require('path');
const massive = require('massive');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const morgan = require('morgan');
const routes = require('./routes/PublicRoutes');
const privateRoutes = require('./routes/PrivateRoutes');
// const { postgraphile } = require('postgraphile');
const { postgraphql } = require('postgraphql');


let connectionInfo = process.env.DATABASE_URL || {
  host: process.env.DATABASE_URL || '127.0.0.1',
  port: 5432,
  database: process.env.DB_NAME || 'gilded',
  user: process.env.DB_USER || (process.platform === 'win32' ? 'postgres' : ''),
  password: process.env.DB_PASSWORD || (process.platform === 'win32' ? 'password' : '')
};

const pgConnection = {
  host: '127.0.0.1',
  user: '',
  password: '',
  database: 'gilded',
  port: 5432
};
const postgraphqlConfig = {
  pgDefaultRole: 'anonymous',
  graphiql: true,
};

let https_redirect = function (req, res, next) {
  if (process.env.NODE_ENV === 'production') {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    } else {
      return next();
    }
  } else {
    return next();
  }
};

massive(connectionInfo).then(instance => {
  app.set('db', instance);
  app.use(https_redirect);
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  // app.use(postgraphql('postgres://localhost:5432'))
  app.use(postgraphql(pgConnection, 'gilded_public', postgraphqlConfig));

  app.use(morgan('dev'));
  app.set('superSecret', '1337hackzors');
  app.get('/api/v1/fields', routes.fields);
  app.get('/api/v1/feed', routes.feed);
  app.get('/api/v1/occupations/:field_id', routes.occupationByFieldID);
  app.get('/api/v1/occupations/:occupation_id/details', routes.occupation);
  app.get('/api/v1/schools', routes.schoolsBySocCode);
  app.get('/api/v1/employers', routes.employersBySocCode);
  app.get('/api/v1/employers/:employer_id/details', routes.employerDetails);
  app.get('/api/v1/mercury', routes.mecuryContentParser);
  app.get('/api/v1/schools/:id/details/:school_id', routes.programsBySchoolID);
  app.get('/api/v1/programs', routes.programsBySocCode);
  app.get('/api/v1/programs/:socCode/:school_id', routes.programs);
  app.post('/api/v1/accounts/facebook', routes.facebookSignup(app));

  let authRoutes = express.Router();
  authRoutes.use(privateRoutes.jwtMiddleware(app));
  authRoutes.get('/me', privateRoutes.me(app));
  authRoutes.post('/bookmarks', privateRoutes.createBookmark(app));
  authRoutes.get('/bookmarks', privateRoutes.bookmarks(app));

  app.use('/api/v1/user', authRoutes);

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });

  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`Gilded on port: ${port}`);
});