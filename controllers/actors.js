const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./riby.db", err => {
  if (err) {
    console.log("i have an error");
  }
});

const checkSActorExist = async id => {
  let sql = `SELECT * FROM actor where id = ?`;

  let row = await db.getAsync(sql, [id]);
  if (row.length != 0) {
    ///means id already exist
    return true;
  }
  return false;
};

db.getAsync = function(sql, data) {
  var that = this;
  return new Promise(function(resolve, reject) {
    that.all(sql, data, function(err, row) {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getAllActors = async () => {
  try {
    let sql = `SELECT a.id as id,a.avatar_url,login,COUNT(e.id) as count  FROM events as e  JOIN  actor as a on a.id = e.actor  where 1 GROUP BY e.actor ORDER BY  count , e.created_at  , a.login`;

    let row = await db.getAsync(sql, []);

    return {
      row
    };
  } catch (error) {
	  console.log(error);
	  
    return {
      error: true
    };
  }
};

const updateActor = async data => {
  try {
    const { avatar_url, id } = data;

    const checkActor = await checkSActorExist(id);

    if (!checkActor) {
      return {
        error: true,
        message: "user does not exist"
      };
    }

    let sql = `Update  actor set  avatar_url = ?  where id = ?`;

    await db.getAsync(sql, [avatar_url, id]);

    return {
      error: false
    };
  } catch (error) {
    console.log(error);

    return {
      error: true
    };
  }
};

const getStreak = async () => {try {

	// i couldnt do this cuz of i myswl and sqlite arent actually the same and 
	// being pressed with that i tried solving this island and gap problem but couldnt implement some fundamental funcrions like 
	// ROW_NUMBER() so basically i would just drop a template of how it should have been done with sql
	// SELECT MIN(seqval) AS start_range, MAX(seqval) AS end_range FROM (SELECT seqval, seqval - ROW_NUMBER() OVER(ORDER BY seqval) AS grp       FROM dbo.NumSeq) AS D GROUP BY grp;
	let sql = `
	
	select * from events where 1
	
	
	`

    let row = await db.getAsync(sql, []);

    return {
      row
    };
  } catch (error) {
	  console.log(error);
	  
    return {
      error: true
    };
  }
};
const saveActor = async data => {
  const { id, login, avatar_url } = data;

  const checkActor = await checkSActorExist(id);

  if (checkActor) {
    return {
      error: true,
      message: "user does not exist"
    };
  }

  sql = `INSERT INTO actor (id,login,avatar_url) values (?,?,?)`;

  await db.getAsync(sql, [id, login, avatar_url]);

  return {
    error: false
  };
};

module.exports = {
  updateActor: updateActor,
  getAllActors: getAllActors,
  getStreak: getStreak,
  saveActor
};
