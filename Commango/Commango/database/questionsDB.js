const db = require("./database");

db.run(`
	CREATE TABLE IF NOT EXISTS questions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		ques TEXT,
		ans TEXT
	)
`);

exports.getAllQuestion = function (callback) {
  const query = "SELECT * FROM questions";

  db.all(query, function (error, questions) {
    callback(error, questions);
  });
};

exports.createQuestion = function (ques, ans, callback) {
  const query = "INSERT INTO questions (ques, ans) VALUES (?, ?)";
  const values = [ques, ans];

  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.getQuestionById = function (id, callback) {
  const query = "SELECT * FROM questions WHERE id = ? LIMIT 1";
  const values = [id];

  db.get(query, values, function (error, question) {
    callback(error, question);
  });
};

exports.updateQuestionById = function (id, ques, ans, callback) {
  const query = "UPDATE questions SET ques = ?, ans = ? WHERE id = ?";
  const values = [ques, ans, id];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteQuestionById = function (id, callback) {
  const query = "DELETE FROM questions WHERE id = ?";
  const values = [id];

  db.run(query, values, function (error) {
    callback(error);
  });
};
