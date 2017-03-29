var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users  = require('./routes/users');


var SessionService = require('./services_v2/Sessions');
var sessionService = new SessionService();

var UserService = require('./services_v2/Users');
var userService = new UserService();

var PointsService = require('./services_v2/Points');
var pointService = new PointsService();

sessionService.CreateIndex();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var cors = require("cors");


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    allowedOrigins: [
        '*'
    ],
    headers: [
        'Access-Control-Allow-Credentials','x-xsrf-token', 'Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'
    ]
}));

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);

app.get('/login', function(req, res, next) {
  console.log(req.query)
  userService.Login(req.query.username, req.query.password)
    .then(function(user){
      if(user){
        res.json({ user: user });
      } else {
        res.status(500).json({});
      }
      
    }, function(err){
      console.log(err);
      res.status(500).json({error: true, message : err.message})
    })
  
});

app.put('/addPoint', function(req, res){
  var points = req.body.point;
  
  pointService.CreatePoint(points).then(function(point){
    res.status(200).json({point: point});
  }, function(err){
    res.status(500).json({errr: true, message: err.message})
  });
});

app.get('/getPoints', function(req, res){
  var idUser = req.query.idUser;
  var page = req.query.page || 1;
  pointService.GetPointsByUserId(idUser,page).then(function(points){
    res.status(200).json(points);
  }, function(err){
    res.status(500).json({errr: true, message: err.message})
  });
});

app.delete('/deletePoint', function(req, res){
  var pointId = req.body.idPoint;
  
  pointService.DeletePoint(pointId).then(function(){
    res.status(200).json({});
  }, function(err){
    res.status(500).json({error : true, message: err.message});
  });

app.post('users/addNotifications', function(req, res){
  userService.AddNotifications(req.body.notification).then(function(){
    res.status(200).json({});
  });
});

app.get('users/getNotifications/:userId', function(req, res){
  userService.GetAllNotifications(req.params.userId).then(function(notifications){
    res.status(200).json(notifications);
  });
});

app.delete('/users/deleteNotifications/:userId/:notificationId', function(req, res){
  var notificationId = req.params.notificationId;
  var userId = req.params.userId;

  userService.DeleteNotification(userId, notificationId).then(function(){
    res.status(200).json({});
  });
});

app.get('users/getNotificationById/:userId/:notificationId', function(req, res){
  var notificationId = req.params.notificationsId;
  var userId = req.params.userId;

  userService.GetNotificationById(notificationId, userId).then(function(notification){
    res.status(200).json(notification);
  });
});


app.use('/', routes);
app.use('/users', users)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
