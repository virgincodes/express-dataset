const Joi = require("@hapi/joi");
const sqlite3 = require("sqlite3").verbose();
const { saveActor } = require("./actors");
const { saveRepo } = require("./repo");
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

const checkSActorExist = async (id) => {
	let sql = `SELECT * FROM actor where id = ?`;

	let row = await db.getAsync(sql, [id]);
	if (row.length != 0) {
		///means id already exist
		return true
	}
	return false
}

const getAllEvents = async () => {
  try {
    let sql = `SELECT *,e.id as id,e.type as type,e.created_at as created_at FROM events as e JOIN  repo as r on e.repo  = r.id JOIN  actor as a on e.actor  = a.id  where 1 ORDER BY id ASC`;
    let row = await db.getAsync(sql, []);
	
    ///format the rows to give it the standard json structure

    const newRow = [];

    for (let i = 0; i < row.length; i++) {
      const element = row[i];
      newRow.push({
        id: element.id,
        type: element.type,
        actor: {
          id: element.actor,
          login: element.login,
          avatar_url: element.avatar_url
        },
        repo: {
          id: element.repo,
          name: element.name,
          url: element.url
        },
        created_at: element.created_at
      });
    }

    return { row: newRow };
  } catch (error) {
    console.log(error);

    return {
      error: true,
      message: "Error occured"
    };
  }
};

const addEvent = async data => {
  const schema = Joi.object({
    id: Joi.number().required(),

    created_at: Joi.string().required(),

    type: Joi.string().required(),

    repo: Joi.object().required(),

    actor: Joi.object().required()
  });
  let value = {};
  try {
    value = await schema.validateAsync(data);
	const { id, created_at, repo, actor, type } = value;

	

    let sql = `SELECT * FROM events where id = ?`;

    let row = await db.getAsync(sql, [id]);
    if (row.length != 0) {
      ///means id already exist
      return {
        error: true,
        message: "Sorry Id already exist"
      };
    }

    sql = `INSERT INTO events (id,created_at,repo,actor,type) values (?,?,?,?,?)`;
    saveActor(actor);
    saveRepo(repo);
    await db.getAsync(sql, [id, created_at, repo.id, actor.id, type]);

    return {
      error: false,
      message: "Added Event"
    };
  } catch (err) {
	  
    return {
      error: true,
      message: "Error occured"
    };
  }
};

const getByActor = async id => {
  try {
    const checkActor = await checkSActorExist(id);

    if (!checkActor) {
      return {
        error: true,
        message: "user does not exist"
      };
    }

    let sql = `SELECT *,e.id,e.type as type,e.created_at as created_at as id FROM events as e JOIN  repo as r on e.repo  = r.id JOIN  actor as a on e.actor  = a.id  where a.id = ? ORDER BY id ASC`;
    let row = await db.getAsync(sql, [id]);

    ///format the rows to give it the standard json structure

    const newRow = [];

    for (let i = 0; i < row.length; i++) {
      const element = row[i];
      newRow.push({
        id: element.id,
        type: element.type,
        actor: {
          id: element.actor,
          login: element.login,
          avatar_url: element.avatar_url
        },
        repo: {
          id: element.repo,
          name: element.name,
          url: element.url
        },
        created_at: element.created_at
      });
    }

    return { row: newRow };
  } catch (error) {
    console.log(error);

    return {
      error: true,
      message: "Error occured"
    };
  }
};


const eraseEvents = async () => {
  try {
    let sql = `DELETE FROM events where 1`;

    await db.getAsync(sql, []);

    return {
      error: false
    };
  } catch (error) {
    return {
      error: true
    };
  }
};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents
};
