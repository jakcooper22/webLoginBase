var express = require('express');
var router = express.Router();

router.get('/bronzePage', function(req, res, next){
	res.set('Content-Type', 'text/html');
  res.render('bronzePage.ejs');
});

module.exports = router;
