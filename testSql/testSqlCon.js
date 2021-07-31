var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../user.db');

db.serialize(() => {
	db.each('SELECT userId, username, password from usersTable', function (err, row) {
		console.log('User: ', row.userId, row.username, row.password);
	});
});

db.close();
