var express = require('express'),
  _ = require('lodash'),
  config = require('./config'),
  jwt = require('jsonwebtoken');
mysql = require('mysql');
var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

var app = module.exports = express.Router();

// XXX: This should be a database of users :).
var user = [{
  // id: 1,
  // username: 'gonto',
  // password: 'gonto'
}];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 1});
}


app.post('/sessions/create', function (req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
    connection.query("SELECT * FROM users WHERE username = ? and password = ?", [req.body.username, req.body.password],
     function (err, rows) {
      if (err)
      {
        return res.status(400).send("You must send the username and the password ");
      }
        if (!rows.length) {
          return res.status(400).send("You must send the username and the password are wrong..");
      }
      else {
         console.log(rows[0].username);
        var user = {
          "username": rows[0].username,
          "password": rows[0].password
        }
        console.log(user);
        res.status(201).send({
          id_token: createToken(user)
        });
      }
    });

});
