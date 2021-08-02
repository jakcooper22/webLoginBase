var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../db/newTableTest');
var fs = require('fs');

function test1() {
  db.serialize(() => {
    db.each('SELECT userId, username, password from usersTable', function (err, row) {
      console.log('User: ', row.userId, row.username, row.password);
    });
  });
};
 
function test2(){
  db.run('insert into usersTable(userId, username, password) values(?,?,?)',
         [123, 'test2', 'test2']);
};

function test3(){
	var path = ( __dirname, '../public/images/imgtest.png');
  var img = fs.readFileSync(path);
	console.log(img);
  db.run('insert into imageTest(img) values(?)', img, function(err){
		if (err) {
			console.log(err);
		};
	});
};

test3();

db.close();
