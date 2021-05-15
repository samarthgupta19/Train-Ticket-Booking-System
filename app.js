const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const searchtext = "";
const request=require("request");

// var passport=require("passport"),
//     User=require("./models/user"),
//     localstrategy=require("passport-local"),
//     passportlocalmongoose=require("passport-local-mongoose");

app.use(bodyParser.urlencoded({
  extended: true,
  useUnifiedTopology: true
}));

app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/reservationdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");


app.get('/', function(req, res) {
  res.render('home');
  //__dirname : It will resolve to your project folder.
});

app.get('/signin', function(req, res) {
  res.render('signin');
});
app.get('/Seat_Availability', function(req, res) {
  res.render('Seat_Availability');
});
app.get('/contact', function(req, res) {
  res.render('contact');
});
app.get('/ticket_schedule', function(req, res) {
  res.render('ticket_schedule');
});

app.get('/signup1', function(req, res) {
  res.render('signup1');
});

//add the router

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
