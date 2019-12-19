const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./riby.db", err => {
  if (err) {
    console.log("i have an error");
  }
});

db.getAsync = function(sql, data) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.all(sql, data, function(err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const saveRepo = async data => {
  const { id, name, url } = data;

  let sql = `SELECT * FROM repo where id = ?`;

  let row = await db.getAsync(sql, [id]);
  if (row.length != 0) {
    ///means id already exist
    return {
      error: false //user added already
    };
  }

  sql = `INSERT INTO repo (id,name,url) values (?,?,?)`;

  await db.getAsync(sql, [id, name, url]);

  return {
    error: false
  };
};

module.exports = { saveRepo };
