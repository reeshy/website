const express = require("express");
const db = require("../database/tasksDb");
const validators = require("../validators/task-validators");

const router = express.Router();

router.get("/", function (request, response) {
  db.getAllTasks(function (error, tasks) {
    if (error) {
      console.log(error);
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      const model = {
        tasks,
        dbErrorOccurred: false,
      };
      response.render("tasks.hbs", model);
    }
  });
});

router.get("/create", function (request, response) {
  response.render("create-task.hbs");
});

router.post("/create", function (request, response) {
  const taskname = request.body.taskname;
  const status = request.body.status;
  const assigneduser = request.body.assigneduser;
  const errors = validators.getValidationErrorsForTask(
    taskname,
    status,
    assigneduser
  );

  if (!request.session.isLoggedIn) {
    errors.push("Must be logged in.");
  }

  if (0 < errors.length) {
    const model = {
      errors,
      taskname,
      status,
      assigneduser,
    };
    response.render("create-task.hbs", model);
    return;
  }
  db.createTask(taskname, status, assigneduser, function (error, id) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      response.redirect("/tasks/" + id);
    }
  });
});

router.get("/update/:id", function (request, response) {
  const id = request.params.id;
  db.getTaskById(id, function (error, task) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      const model = {
        task,
        dbErrorOccurred: false,
      };
      response.render("update-task.hbs", model);
    }
  });
});
router.post("/update/:id", function (request, response) {
  const id = request.params.id;
  const newtaskname = request.body.taskname;
  const newstatus = request.body.status;
  const newassigneduser = request.body.assigneduser;
  const errors = validators.getValidationErrorsForTask(
    newtaskname,
    newstatus,
    newassigneduser
  );

  if (!request.session.isLoggedIn) {
    errors.push("Must be logged in.");
  }
  if (0 < errors.length) {
    const model = {
      errors,
      task: {
        id,
        taskname: newtaskname,
        status: newstatus,
        assigneduser: newassigneduser,
      },
    };
    response.render("update-task.hbs", model);
    return;
  }
  db.updateTaskById(
    newtaskname,
    newstatus,
    newassigneduser,
    id,
    function (error) {
      if (error) {
        const model = {
          dbErrorOccurred: true,
        };
        response.render("tasks.hbs", model);
      } else {
        response.redirect("/tasks/" + id);
      }
    }
  );
});

router.get("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.getTaskById(id, function (error, task) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      const model = {
        task,
        dbErrorOccurred: false,
      };
      response.render("delete-task.hbs", model);
    }
  });
});

router.post("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.deleteTaskById(id, function (error) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      response.redirect("/tasks");
    }
  });
});

router.get("/:id", function (request, response) {
  const id = request.params.id;

  db.getTaskById(id, function (error, task) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("tasks.hbs", model);
    } else {
      const model = {
        task,
      };
      response.render("task.hbs", model);
    }
  });
});

module.exports = router;
