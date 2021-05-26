const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const searchtext = "";
const request=require("request");
var passport = require("passport"),

    User = require("./models/user"),
    localstrategy = require("passport-local"),
    passportlocalmongoose = require("passport-local-mongoose");


app.use(bodyParser.urlencoded({
  extended: true,
  useUnifiedTopology: true
}));

app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/reservationdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");










app.use(require("express-session")({
    secret: "hello whats up???!!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//====================
//Routes
//====================






const train_scheduleSchema={
  train_no: String,
  train_name:String,
  from:String,
  to:String,
  runs_on:String
};
var seatavailabilitytableSchema=new mongoose.Schema({
  train_no: String,
  class:String,
  status:String
});







app.get("/signup1", function(req, res) {
    res.render("signup1");
});

app.post("/signup1", function(req, res) {
    // req.body.username
    // req.body.passport
    User.register(new User({ username: req.body.uid }), req.body.pass, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('signup1');
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/ticket_booking");
        });
    });
});
//login routes
app.get("/signin", function(req, res) {
    res.render("signin");
});
app.post("/signin", passport.authenticate("local", {
    successRedirect: "/ticket_booking",
    failureRedirect: "/signin"
}), function(req, res) {});


//middleware

function isloggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/signin");
}



app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});



app.get("/ticket_booking", isloggedin, function(req, res) {
    res.render("ticket_booking");
});
app.post("/ticket_booking", isloggedin, function(req, res) {
    res.render("ticket_booking");
});





app.get('/', function(req, res) {
  res.render('home');
});
app.post('/', function(req, res) {
  res.render('home');
});







app.post('/Availability_table',isloggedin,function(req,res){
  res.render('Availability_table');
});



app.get('/payment_gateway',isloggedin,function(req,res){
  res.render('payment_gateway');
});






app.get('/Seat_Availability',isloggedin, function(req, res) {
  res.render('Seat_Availability');
});
app.post('/Seat_Availability',isloggedin, function(req, res) {
  res.render('Seat_Availability');
});




app.get('/contact', function(req, res) {
  res.render('contact');
});




app.get('/ticket_schedule',isloggedin, function(req, res) {
  res.render('ticket_schedule');
});










app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
