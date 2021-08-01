var express = require('express');
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('../newTableTest');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var router = express.Router();

/* GET users listing. */
router.post('/users', function(req, res, next) {
  var db = new sqlite3.Database("db/newTableTest");
  db.run('Create table usersTable(userId int, username varchar, password varchar)', (error) => {
    if (error) {
      db.run('insert into usersTable(userId, username, password) values(?,?,?)',
              [1234, req.body.uname, md5(req.body.pword)], (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('inserted new user into table and db is already created');  
          db.close();
          const token = jwt.sign({"uname":req.body.uname, 
                                  "pword":md5(req.body.pword)},
                                  "piauwhakjsdnfakjsdhf34980745ljkhaaf",
                                 {
                                   expiresIn: "2h"
                                 });
          const decodedToken = jwt.verify(token, "piauwhakjsdnfakjsdhf34980745ljkhaaf");
          res.json({
            "message" : "success",
            "token" : token,
            "decodedToken" : decodedToken
          });
        }
      });
    } else {
      console.log('table created');
      db.run('insert into usersTable(userId, username, password) values(?,?,?)',
              [1234, req.body.uname, md5(req.body.pword)], (err) => {
        if (err) {
          console.log(err);
          res.json({
            "message" : "error",
            "data" : {
              "username" : req.body.uname,
              "pword" : req.body.pword
            }
          });
        } else {
          console.log('inserted new user into table and db is not created');  
          res.json({
            "message" : "user inserted"
          });
          db.close();          
        }
      });
    };
  });
});

module.exports = router;
