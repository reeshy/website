const express = require("express");
const validators = require("../validators/questions-validators");
const db = require("../database/questionsDB");

const router = express.Router();

router.get("/", function (request, response) {
  db.getAllQuestion(function (error, questions) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        questions: [],
      };
      response.render("questions.hbs", model);
    } else {
      const model = {
        hasDatabaseError: false,
        questions,
      };
      response.render("questions.hbs", model);
    }
  });
});

router.get("/create", function (request, response) {
  response.render("create-question.hbs");
});

router.post("/create", function (request, response) {
  const ques = request.body.ques;
  const ans = request.body.ans;
  const errors = validators.getValidationErrorsForQuestions(ques, ans);

  if (!request.session.isLoggedIn) {
    errors.push("Not logged in.");
  }

  if (errors.length == 0) {
    db.createQuestion(ques, ans, function (error, questionId) {
      if (error) {
        errors.push("Internal server error.");
        const model = {
          errors,
          ques,
          ans,
        };
        response.render("create-question.hbs", model);
      } else {
        response.redirect("/questions/" + questionId);
      }
    });
  } else {
    const model = {
      errors,
      ques,
      ans,
    };
    response.render("create-question.hbs", model);
  }
});

router.get("/:id", function (request, response) {
  const id = request.params.id;
  db.getQuestionById(id, function (error, question) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("questions.hbs", model);
    } else {
      const model = {
        question,
      };
      response.render("question.hbs", model);
    }
  });
});

router.get("/:id/update", function (request, response) {
  const id = request.params.id;

  db.getQuestionById(id, function (error, question) {
    // TODO: Handle error.
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("questions.hbs", model);
    } else {
      const model = {
        question,
      };
      response.render("update-question.hbs", model);
    }
  });
});

router.post("/:id/update", function (request, response) {
  const id = request.params.id;
  const ques = request.body.ques;
  const ans = request.body.ans;
  const errors = validators.getValidationErrorsForQuestions(ques, ans);

  if (!request.session.isLoggedIn) {
    errors.push("Not logged in.");
  }

  if (errors.length == 0) {
    db.updateQuestionById(id, ques, ans, function (error) {
      // TODO: Handle error.
      if (error) {
        const model = {
          dbErrorOccurred: true,
        };
        response.render("questions.hbs", model);
      } else {
        response.redirect("/questions/" + id);
      }
    });
  } else {
    const model = {
      errors,
      question: {
        id,
        ques,
        ans,
      },
    };
    response.render("update-question.hbs", model);
  }
});

router.get("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.getQuestionById(id, function (error, question) {
    // TODO: Handle error.
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("questions.hbs", model);
    } else {
      const model = {
        question,
      };
      response.render("delete-question.hbs", model);
    }
  });
});

router.post("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.deleteQuestionById(id, function (error) {
    if (error) {
      const model = {
        dbErrorOccurred: true,
      };
      response.render("questions.hbs", model);
    } else {
      response.redirect("/questions");
    }
  });
});

module.exports = router;
