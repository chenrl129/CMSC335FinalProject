const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.set("views", path.resolve(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(__dirname + '../public'));

app.use((req, res, next) => {
  if (req.originalUrl !== "/favicon.ico") {
    console.log(`${new Date().toString()} => ${req.originalUrl}`, Object.keys(req.body).length ? req.body : "");
  }
  next();
});

module.exports = app;