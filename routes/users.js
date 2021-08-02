var express = require('express');
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database("db/newTableTest");
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var router = express.Router();

var errorMsg = {
  "message" : "failed",
	"status" : "no password"
}

/* GET users listing. */
router.post('/newUsers', function(req, res, next) {
	var db = new sqlite3.Database("db/newTableTest");
  db.run('Create table usersTable(userId integer primary key autoincrement,' +  
	       'username varchar, password varchar, email varchar)', (error) => {
	  //sql table aready exists
    if (error) {
			console.log(error);
			console.log(req.body);
			if (req.body.pword == ''){
				console.log('password is blank');
				res.json(errorMsg);
			  return;
			}
			console.log('going to insert');
      db.run('insert into usersTable(email, username, password) values(?,?,?)',
              [req.body.email, req.body.uname, md5(req.body.pword)], (err) => {
        if (err) {
					console.log(err);
					res.json(errorMsg);
        } else {
          console.log('inserted new user into table and db is already created');  
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
      db.run('insert into usersTable(email, username, password) values(?,?,?)',
              [req.body.email, req.body.uname, md5(req.body.pword)], (err) => {
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
        }
      });
    };
  });
	db.close();
});

router.post('/loginUser', function(req, res, next) {
  console.log(req.body);
	try {
	  const decodeToken = jwt.verify(req.body.token, "piauwhakjsdnfakjsdhf34980745ljkhaaf");
		console.log(decodeToken);
	} catch (error) {
	  console.log(error);
	};
});

router.get('/image', function(req, res, next) {
  var db = new sqlite3.Database("db/newTableTest");
	db.all('select * from imageTest', function(err, row) {
    if (err){
			console.log(err);
		}else {
			console.log('might be working');
			res.header('Content-Type', 'image.jpeg');
			res.end(JSON.stringify(row));
		};
	});
});

router.post('/users/tokenPage', function(req, res, next) {
  var db = new sqlite3.Database("db/newTableTest");
	try {
	  console.log('hit users/token');
    console.log(req.body);	
	  const decodedToken = jwt.verify(req.body.token, "piauwhakjsdnfakjsdhf34980745ljkhaaf");
	  console.log(decodedToken.uname);
		db.all('select userPage ' +
		       'from userPages a ' +
           'join usersTable b ' + 
					 'on b.username = \'' + String(decodedToken.uname) + '\'', function(err, rows) {
		  if (!err) {
				rows.forEach(function(row) {
          console.log(row);
				});
			} else {
				console.log(err);
			};
		});				
	} catch (error) {
    console.log(error);
	}
});

module.exports = router;
