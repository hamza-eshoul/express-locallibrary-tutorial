var createError = require("http-errors"); //http-errors Node library
var express = require("express");
var path = require("path"); //built-in Node module
var cookieParser = require("cookie-parser"); // cookie parser Node library
var logger = require("morgan"); //morgan ogger Node library
const mongoose = require("mongoose"); //import the mongoose module
const dotenv = require("dotenv").config();

// set strictQuery to false
mongoose.set("strictQuery", false);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

var app = express();

// connect to db
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}
main().catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views")); //Set the views value to specify the folder where the templates will be stored (in this case subfolder/views)
app.set("view engine", "pug"); //Set the 'view' engine value to specify the template library (in this case "pug")

// Add the middleware libraries that we imported above into the request handling chain

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

// Apply rate limiter to all requests
app.use(limiter);

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["self", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(compression());
app.use(logger("dev"));
app.use(express.json()); // needed to populate req.body with the form fields
app.use(express.urlencoded({ extended: false })); // needed to populate req.body with the form fields
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //makes Express serve all the static files in the /public directory in the project root.

// Define particular routes for the different parts of the site
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// add module exports to allow it to be imported by /bin/www
module.exports = app;
