var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');


// Database connection
require('dotenv').config(); 
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connection successful!');
});

// Routes
var indexRouter = require('./routes/index');
var clientRouter = require('./routes/clientRoutes');
var roomRouter = require('./routes/roomRoutes');
var staffRouter = require('./routes/staffRoutes');
var packageRouter = require('./routes/packageRoutes');
var roomHasPackageRouter = require('./routes/roomHasPackageRoutes');
var clientHasRoomRouter = require('./routes/clientHasRoomRoutes');
var ingredientRouter = require('./routes/ingredientRoutes');
var mealRouter = require('./routes/mealRoutes');
var orderRouter = require('./routes/orderRoutes');
var informationRouter = require('./routes/informationRoutes');

var app = express();

// CORS
var cors = require('cors');
var allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/clients', clientRouter);
app.use('/rooms', roomRouter);
app.use('/staff', staffRouter);
app.use('/packages', packageRouter);
app.use('/roomHasPackages', roomHasPackageRouter);
app.use('/clientHasRooms', clientHasRoomRouter);
app.use('/ingredients', ingredientRouter);
app.use('/meals', mealRouter);
app.use('/orders', orderRouter);
app.use('/info', informationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;