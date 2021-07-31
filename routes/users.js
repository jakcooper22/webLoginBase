var express = require('express');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('usersTable');
var router = express.Router();

/* GET users listing. */
router.post('/users', function(req, res, next) {
  //console.log('got a request for a user');
	res.send('got a user req');
	console.log('got a user req');
	console.log(req.body);
	  
});

module.exports = router;
