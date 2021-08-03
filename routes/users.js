var express = require('express');
var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database("db/newTableTest");
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var router = express.Router();

var errMsgPword = {
  "message" : "failed",
	"status" : "no password"
}

var errMsgEmail = {
	"message" : "failed",
	"status" : "email is in use"
};

/* GET users listing. */
router.post('/newUsers', function(req, res, next) {
	var db = new sqlite3.Database("db/newTableTest");
	var sqlCreate = 'create table usersTable(userId integer primary key autoincrement,' +
	                'username varchar, password varchar, email varchar)';
	var sqlInsert = 'insert into usersTable(email, username, password) values(?,?,?)';

  db.run(sqlCreate, (error) => {
	  //sql table aready exists
    if (error) {
			console.log(error);
			console.log(req.body);
			if (req.body.pword == ''){
				console.log('password is blank');
				res.json(errMsgPword);
			  return;
			}
			console.log('going to insert');
      db.run(sqlInsert, [req.body.email, req.body.uname, md5(req.body.pword)], (err) => {
        if (err) {
					console.log(err);
					res.json(errMsgPword);
        } else {
          console.log('inserted new user into table and db is already created');  
          const token = jwt.sign({
																	"uname":req.body.uname, 
                                  "email":req.body.email 
																	},
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
      db.run(sqlInsert, [req.body.email, req.body.uname, md5(req.body.pword)], (err) => {
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
	//res.end();
});

router.post('/loginUser', function(req, res, next) {
	var db = new sqlite3.Database("db/newTableTest");
  //console.log(req.body);
	try {
	  const decodedToken = jwt.verify(req.body.token, "piauwhakjsdnfakjsdhf34980745ljkhaaf");
		//console.log(decodedToken);
		db.all('select userPage ' +
					 'from userPages a ' +
					 'join usersTable b ' +
					 'on a.userId = b.userId ' +
					 'and b.email = \'' + decodedToken.email + '\'', function(err, rows) {
			if (!err) {
				console.log(rows);
				rows.forEach(function(item){
					console.log('retruned sql' + item);
					if (item.userPage == 'bronzePage'){
						console.log('going to send bronze page');
						res.redirect('/bronzePage');
					};
				});
			}else {
				console.log(err);
			};
		});	
	} catch (error) {
	  console.log(error);
	};
});

//router.get('/bronzePage', function(req, res, next){
//	console.log('trying to open bronze page');
//	try {
//    res.render('bronzePage');
//	} catch(err) {
//		console.log(err);
//	};
//	res.end();
//});

router.get('/image', function(req, res, next) {
  var db = new sqlite3.Database("db/newTableTest");
	db.all('select * from imageTest', function(err, row) {
    if (err){
			console.log(err);
		}else {
			row.forEach(function(item){
				//console.log(item.img);
				res.end(item.img);
			});
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
