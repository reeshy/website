const express = require("express");
const expressHandlebars = require("express-handlebars");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const productsRouter = require("./routers/product-router");
const SQLiteStore = require("connect-sqlite3")(expressSession);
const authRouter = require("./routers/auth-router");
const humansRouter = require("./routers/humansRouter");
const tasksRouter = require("./routers/tasksRouter");
const questionsRouter = require("./routers/questions-router");
const app = express();

app.use(express.static("static"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(
  expressSession({
    secret: "asdsasdadsasdasdasds",
    saveUninitialized: false,
    resave: false,
    // TODO: Save the sessions in a session store.
  })
);

app.use(function (request, response, next) {
  // Make the session available to all views.
  response.locals.session = request.session;
  next();
});

app.engine(
  ".hbs",
  expressHandlebars({
    defaultLayout: "main.hbs",
    extname: "hbs",
  })
);

app.use("/products", productsRouter);
app.use("/auth", authRouter);
app.use("/humans", humansRouter);
app.use("/tasks", tasksRouter);
app.use("/questions", questionsRouter);

app.get("/", function (request, response) {
  response.render("start.hbs");
});

app.get("/about", function (request, response) {
  response.render("about.hbs");
});

app.get("/contact", function (request, response) {
  response.render("contact.hbs");
});

// last route
app.use(function (req, res) {
  res.send("404 NOT FOUND");
});

app.listen(8080);
