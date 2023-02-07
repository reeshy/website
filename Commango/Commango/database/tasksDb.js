const db = require("./database");

db.run(`
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		taskname TEXT,
		status TEXT,
		assigneduser TEXT
		
	)
`);

exports.getAllTasks = function (callback) {
  const query = "SELECT * FROM tasks ORDER BY id";

  db.all(query, function (error, tasks) {
    callback(error, tasks);
  });
};

exports.createTask = function (taskname, status, assigneduser, callback) {
  const query =
    "INSERT INTO tasks (taskname,status,assigneduser) VALUES (?, ?, ?)";
  const values = [taskname, status, assigneduser];

  db.run(query, values, function (error) {
    callback(error, this.lastID);
  });
};

exports.getTaskById = function (id, callback) {
  const query = "SELECT * FROM tasks WHERE id = ?";
  const values = [id];

  db.get(query, values, function (error, task) {
    callback(error, task);
  });
};

exports.updateTaskById = function (
  taskname,
  status,
  assigneduser,
  id,
  callback
) {
  const query = `
		UPDATE
			tasks
		SET
		taskname = ?,
		status = ?,
		assigneduser = ?
		WHERE
			id = ?
	`;
  const values = [taskname, status, assigneduser, id];

  db.run(query, values, function (error) {
    callback(error);
  });
};

exports.deleteTaskById = function (id, callback) {
  const query = "DELETE FROM tasks WHERE id = ?";
  const values = [id];

  db.run(query, values, function (error) {
    callback(error);
  });
};
