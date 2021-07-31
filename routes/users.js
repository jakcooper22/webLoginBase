var express = require('express');
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('../newTableTest');
var router = express.Router();

/* GET users listing. */
router.post('/users', function(req, res, next) {
  var db = new sqlite3.Database("../newTableTest");
  db.run('Create table usersTable(userId int, username varchar, password varchar)', (error) => {
    if (error) {
      db.run('insert into usersTable(userId, username, password) values(?,?,?)',
              [1234, req.body.uname, req.body.pword], (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('inserted new user into table');  
          db.close();
        }
      });
    } else {
      console.log('table created');
    };
  });
});

function initDB() {
  //db

}

module.exports = router;
