const JWT = require('jsonwebtoken');

let jwtMiddleware = (app) => (req, res, next) => {
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
};

let bookmarks = (app) => (req, res) => {
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
};

exports.jwtMiddleware = jwtMiddleware;
exports.me = me;
exports.createBookmark = createBookmark;
exports.bookmarks = bookmarks;
