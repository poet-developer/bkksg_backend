const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const adminRouter = require("./routes/admin");
const indexRouter = require("./routes/index");
// const cors = require("cors")
const app = express();

// app.use(cors());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // general config
app.engine('ejs', require('ejs').__express);
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/', indexRouter);
// app.use(express.static(path.join(__dirname, "../bkksg_frontend/build")));
 
// app.use("/", function (req, res, next) {
//   res.sendFile(path.join(__dirname + "../bkksg_frontend/build", "index.html"));
// });
app.use("/admin", adminRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


module.exports = app;
