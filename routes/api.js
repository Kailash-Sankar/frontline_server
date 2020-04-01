var express = require("express");
var authRouter = require("./auth");
var mainRouter = require("./main");

var app = express();

app.use("/auth/", authRouter);
app.use("/", mainRouter);

module.exports = app;
