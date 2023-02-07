const express = require("express");
const db = require("../database/humanDb");
const validators = require("../validators/human-validators");

const router = express.Router();

router.get("/", function (request, response) {
  db.getAllHumans(function (error, humans) {
    if (error) {
      console.log(error);
      const model = {
        dbErrorOccurred: true,
      };
      response.render("humans.hbs", model);
    } else {
      const model = {
        humans,
        dbErrorOccurred: false,
      };
      response.render("humans.hbs", model);
    }
  });
});

router.get("/create", function (request, response) {
  response.render("create-human.hbs");
});

router.post("/create", function (request, response) {
  const firstname = request.body.firstname;
  const lastname = request.body.lastname;
  const email = request.body.email;
  const city = request.body.city;

  const errors = validators.getValidationErrorsForHuman(
    firstname,
    lastname,
    email,
    city
  );

  if (!request.session.isLoggedIn) {
    errors.push("Must be logged in.");
  }

  if (0 < errors.length) {
    const model = {
      errors,
      firstname,
      lastname,
      email,
      city,
    };
    response.render("create-human.hbs", model);
    return;
  }

  db.createHuman(firstname, lastname, email, city, function (error, id) {
    if (error) {
      error.push("Internal server error");

      const model = {
        error,
        firstname,
        lastname,
        email,
        city,
      };

      response.render("/humens/" + id, model);
    } else {
      response.redirect("/humans/" + id);
    }
  });
});

router.get("/update/:id", function (request, response) {
  const id = request.params.id;

  db.getHumanById(id, function (error, human) {
    if (error) {
      error.push("Internal server error");

      const model = {
        error,
        firstname,
        lastname,
        email,
        city,
      };
      response.render("/humens/" + id, model);
    } else {
      const model = {
        human,
      };
      response.render("update-human.hbs", model);
    }
  });
});

router.post("/update/:id", function (request, response) {
  const id = request.params.id;
  const newfirstname = request.body.firstname;
  const newlastname = request.body.lastname;
  const newemail = request.body.email;
  const newcity = request.body.city;

  const errors = validators.getValidationErrorsForHuman(
    newfirstname,
    newlastname,
    newemail,
    newcity
  );

  if (!request.session.isLoggedIn) {
    errors.push("Must be logged in.");
  }

  if (0 < errors.length) {
    const model = {
      errors,
      human: {
        id,
        firstname: newfirstname,
        lastname: newlastname,
        email: newemail,
        city: newcity,
      },
    };
    response.render("update-human.hbs", model);
    return;
  }

  db.updateHumanById(
    newfirstname,
    newlastname,
    newemail,
    newcity,
    id,
    function (error) {
      if (error) {
        error.push("Internal server error");

        const model = {
          error,
          newfirstname,
          newlastname,
          newemail,
          newcity,
        };
        response.render("/humens/" + id, model);
      } else {
        response.redirect("/humans/" + id);
      }
    }
  );
});

router.get("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.getHumanById(id, function (error, human) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        firstname,
        lastname,
        email,
        city,
      };
      response.render("/humens/" + id, model);
    } else {
      const model = {
        human,
      };
      response.render("delete-human.hbs", model);
    }
  });
});

router.post("/:id/delete", function (request, response) {
  const id = request.params.id;
  db.deleteHumanById(id, function (error) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        firstname,
        lastname,
        email,
        city,
      };
      response.render("/humans/" + id, model);
    } else {
      response.redirect("/humans");
    }
  });
});

router.get("/:id", function (request, response) {
  const id = request.params.id;
  db.getHumanById(id, function (error, human) {
    if (error) {
      error.push("Internal server error");

      const model = {
        error,
        firstname,
        lastname,
        email,
        city,
      };
      response.render("/humens/" + id, model);
    } else {
      const model = {
        human,
      };
      response.render("human.hbs", model);
    }
  });
});

module.exports = router;
