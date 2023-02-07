const db = require("./database");

db.run(`
	CREATE TABLE IF NOT EXISTS humans (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		firstname TEXT,
		lastname TEXT,
		email TEXT,
		city TEXT		
	)
`);

exports.getAllHumans = function (callback) {
  const query = "SELECT * FROM humans ORDER BY id";

  db.all(query, function (error, humans) {
    callback(error, humans);
  });
};

exports.createHuman = function (firstname, lastname, email, city, callback) {
  const query =
    "INSERT INTO humans (firstname,lastname,email,city) VALUES (?, ?, ?, ?)";
  const values = [firstname, lastname, email, city];

  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.getHumanById = function (id, callback) {
  const query = "SELECT * FROM humans WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, human) {
    callback(error, human);
  });
};

exports.updateHumanById = function (
  firstname,
  lastname,
  email,
  city,
  id,
  callback
) {
  const query = `
		UPDATE
			humans
		SET
			firstname = ?,
			lastname = ?,
			email = ?,
			city = ?
		WHERE
			id = ?
	`;
  const values = [firstname, lastname, email, city, id];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteHumanById = function (id, callback) {
  const query = "DELETE FROM humans WHERE id = ?";
  const values = [id];

  db.run(query, values, function (error) {
    callback(error);
  });
};
