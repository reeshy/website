const express = require("express");
const bcrypt = require("bcrypt");

const ADMIN_USERNAME = "Alice";
const ADMIN_PASSWORD =
  "$2b$10$Ge82hFAnlBj.EsI9V5gOHesmsCp2Bd7Br9jexyVczkAimITz6JF0G";

const router = express.Router();

router.get("/login", function (request, response) {
  response.render("login.hbs");
});

router.post("/login", function (request, response) {
  const insertedUsername = request.body.username;
  const insertedPassword = request.body.password;

  bcrypt.compare(insertedPassword, ADMIN_PASSWORD, function (error, result) {
    if (error) {
      error = "Some thing went wrong, please try again later";
      const model = {
        error,
      };
      response.render("login.hbs", model);
    } else {
      if (result && insertedUsername == ADMIN_USERNAME) {
        request.session.isLoggedIn = true;
        response.redirect("/");
      } else {
        error = "Wrong Username or Password";
        const model = {
          error,
          failedToLogin: true,
        };
        response.render("login.hbs", model);
        return;
      }
    }
  });
});

router.post("/logout", function (request, response) {
  request.session.isLoggedIn = false;
  response.redirect("/");
});

module.exports = router;
