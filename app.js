const express = require("express");

const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const searchtext = "";
const request = require("request");
var passport = require("passport"),
  User = require("./models/user"),
  localstrategy = require("passport-local"),
  passportlocalmongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/reservation", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const app = express();


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));


app.set("view engine", "ejs");









app.use(require("express-session")({
  secret: "hello whats up???!!!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//====================
//Routes
//====================






const train_Schema = {
  train_no: String,
  train_name: String,
  from: String,
  to: String,
  runs_on: String
};
var seatavailabilitytableSchema = {
  train_no: String,
  date: String,
  class: String,
  seats: String
};

var train_scheduleSchema = {
  train_no: String,
  station_code: String,
  station: String,
  arrival: String,
  departure: String,
  halt: String
};

var Trains = mongoose.model("Trains", train_Schema);
var Seats = mongoose.model("Seats", seatavailabilitytableSchema);
var Schedules = mongoose.model("Schedule", train_scheduleSchema)






app.get("/signup1", function(req, res) {
  res.render("signup1");
});

app.post("/signup1", function(req, res) {

  User.register(new User({
    username: req.body.uid
  }), req.body.pass, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('signup1');
    }
  });
}, passport.authenticate('local', {
  successRedirect: '/ticket_booking',
  failureRedirect: '/signin'
}));
//login routes





app.get("/signin", function(req, res) {
  res.render("signin");
});
app.post("/signin", passport.authenticate("local", {
  successRedirect: "/signin",
  failureRedirect: "/ticket_booking"
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



app.get("/ticket_booking", function(req, res) {
  res.render("ticket_booking");
});
app.post("/ticket_booking", function(req, res) {
  res.render("ticket_booking");
});





app.get('/', function(req, res) {
  res.render('home');
});
app.post('/', function(req, res) {
  res.render('home');
});







app.post('/Availability_table', function(req, res) {
  Trains.find({}, function(err, foundTrain) {
  Seats.find({}, function(err, foundSeat) {
    res.render("Availability_table", {
      trains: foundTrain,
      seats:foundSeat
    });
  })})
});






app.get('/payment_gateway', function(req, res) {
  res.render('payment_gateway');
});



var date;


app.get('/Seat_Availability', function(req, res) {
  res.render('Seat_Availability');
});
app.post('/Seat_Availability', function(req, res) {
  date = req.body.jdate;
  console.log(date);
  res.render('Seat_Availability');
});




app.get('/contact', function(req, res) {
  res.render('contact');
});




app.get('/ticket_schedule', function(req, res) {
  Trains.find({}, function(err, foundTrain) {
  Schedules.find({}, function(err, foundSchedule) {
    res.render("ticket_schedule", {
      trains: foundTrain,
      schedules:foundSchedule
    });
  })})
});



app.get("/admin_addtrains", function(req, res) {
  Trains.find({}, function(err, foundTrain) {

    res.render("admin_addtrains");

    //console.log(foundBlog.content);

    //res.redirect("/");

  });
});

app.post("/admin_addtrains", function(req, res) {

  const trainname = _.toUpper(req.body.tname);
  const trainno = req.body.tno;
  const from_st = _.toUpper(req.body.fromst);
  const to_st = _.toUpper(req.body.tost);
  const runson = _.toUpper(req.body.runson);

  const train = new Trains({
    train_no: trainno,
    train_name: trainname,
    from: from_st,
    to: to_st,
    runs_on: runson
  });
  Trains.findOne({
    train_no: trainno
  }, function(err, foundTrain) {
    if (!foundTrain) {

      train.save()
      res.redirect("/");



    } else {
      console.log(err);
    }
    //res.redirect("/");
  })
});




//to add schedule





app.get("/admin_addschedule", function(req, res) {
  Schedules.find({}, function(err, foundTrain) {

    res.render("admin_addschedule");

    //console.log(foundBlog.content);

    //res.redirect("/");

  });
});

app.post("/admin_addschedule", function(req, res) {

  const trainno = req.body.tno;
  const station_code1 = _.toUpper(req.body.code);
  const station = _.toUpper(req.body.stn);
  const arrival = _.toUpper(req.body.arrival);
  const departure = _.toUpper(req.body.departure);
  const halt = req.body.halt;

  const schedule = new Schedules({
    train_no: trainno,
    station_code: station_code1,
    station: station,
    arrival: arrival,
    departure: departure,
    halt: halt
  });
  Schedules.findOne({
    train_no: trainno,
    station_code: station_code1,
    station: station,
    arrival: arrival,
    departure: departure,
    halt: halt
  }, function(err, foundSchedule) {
    if (!foundSchedule) {

      schedule.save()
      res.redirect("/");



    } else {
      console.log(err);
    }
    //res.redirect("/");
  })
});



//to add seats into trains






app.get("/admin_addseats", function(req, res) {
  Seats.find({}, function(err, foundSeats) {

    res.render("admin_addseats");

    //console.log(foundBlog.content);

    //res.redirect("/");

  });
});





app.post("/admin_addseats", function(req, res) {


  const trainno = req.body.tno;
  const class_type =_.toUpper( req.body.class);
  const date = req.body.date;
  const seat_number = req.body.seats;

  const seat = new Seats({
    train_no: trainno,
    class: class_type,
    date: date,
    seats: seat_number

  });
  Seats.findOne({
    train_no: trainno,
    class: class_type,
    date: date
  }, function(err, foundSeat) {
    if (!foundSeat) {

      seat.save()
      res.redirect("/");



    } else {
      console.log(err);
    }
    //res.redirect("/");
  })
});









app.listen(3000, function() {

  console.log('Running at Port 3000');

});
