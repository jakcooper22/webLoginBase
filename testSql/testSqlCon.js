var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../user.db');

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

test2();

db.close();
