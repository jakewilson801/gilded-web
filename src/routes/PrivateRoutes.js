const JWT = require('jsonwebtoken');

let jwtMiddleware = (app) => (req, res, next) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  if (jwtToken) {
    JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
      if (err) {
        res.status(401).json({success: false, message: 'Failed to authenticate token.'});
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).send({
      success: false,
      message: 'No token provided.'
    });
  }
};

let me = (app) => (req, res) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
    if (err) {
      res.status(401).send("Invalid auth");
    } else {
      req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => res.json(data));
    }
  });
};

let createBookmark = (app) => (req, res) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
    if (err) {
      res.status(401).send({error: "Invalid auth"});
    } else {
      req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
        let values = [data[0].id, req.body.occupation_id];
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
};

let createProgramBookmark = (app) => (req, res) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
    if (err) {
      res.status(401).send({error: "Invalid auth"});
    } else {
      req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
        let values = [data[0].id, req.body.program_id];
        req.app.get('db').run("select * from gilded_private.programbookmarks where user_id = $1 and program_id = $2", values).then(data => {
          if (data.length > 0) {
            req.app.get('db').run("delete from gilded_private.programbookmarks where user_id = $1 and program_id = $2", values).then(data => {
              res.status(202).send({message: "Successfully deleted"});
            }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
          } else {
            req.app.get('db').run("insert into gilded_private.programbookmarks(user_id, program_id) values ($1,$2)", values).then(data => {
              res.status(201).send({message: "Successfully created"});
            }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
          }
        });
      });
    }
  });
};

let createEmployerBookmark = (app) => (req, res) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
    if (err) {
      res.status(401).send({error: "Invalid auth"});
    } else {
      req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
        let values = [data[0].id, req.body.employer_id];
        req.app.get('db').run("select * from gilded_private.employerbookmarks where user_id = $1 and employer_id = $2", values).then(data => {
          if (data.length > 0) {
            req.app.get('db').run("delete from gilded_private.employerbookmarks where user_id = $1 and employer_id = $2", values).then(data => {
              res.status(202).send({message: "Successfully deleted"});
            }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
          } else {
            req.app.get('db').run("insert into gilded_private.employerbookmarks(user_id, employer_id) values ($1,$2)", values).then(data => {
              res.status(201).send({message: "Successfully created"});
            }).catch(error => res.status(400).send({error: "Error creating bookmark"}));
          }
        });
      });
    }
  });
};

let bookmarks = (app) => (req, res) => {
  let jwtToken = req.body.token || req.query.token || req.headers['x-access-token'];
  JWT.verify(jwtToken, app.get('superSecret'), (err, decoded) => {
    if (err) {
      res.status(401).send({error: "Invalid auth"});
    } else {
      req.app.get('db').run("select * from gilded_private.accounts where fb_user_id = $1", [decoded.data.user_id]).then(data => {
        let user_id = data[0].id;
        let queries = [];
        queries.push(req.app.get('db').run("select * from gilded_public.occupations where id in (select occupation_id from gilded_private.occupationbookmarks where user_id = $1)", [user_id]));
        queries.push(req.app.get('db').run("select program.*, school.image_background_url, school.title as school_title from gilded_public.programs program, gilded_public.schools school where program.id in (select program_id from gilded_private.programbookmarks where user_id = $1) and program.school_id = school.id", [user_id]));
        queries.push(req.app.get('db').run("select * from gilded_public.employers where id in (select employer_id from gilded_private.employerbookmarks where user_id = $1)", [user_id]));
        Promise.all(queries).then(data => res.json({occupations: data[0], programs: data[1], employers: data[2]}));
      });
    }
  });
};

module.exports = {
  jwtMiddleware: jwtMiddleware,
  me: me,
  createBookmark: createBookmark,
  createEmployerBookmark: createEmployerBookmark,
  createProgramBookmark: createProgramBookmark,
  bookmarks: bookmarks
};
