var express = require('express');
var swig = require('swig');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

var foods =  ['Cake', 'Bread', 'Spinach', 'Liver', 'Cucumber'].map(function (food) {
  return { name: food };
});

app.get('/api/foods', function (request, response, next) {
  console.log('Sending foods array:');
  console.log(foods);
  return response.json(foods);
});

app.get('/api/foods/:id', function (request, response, next) {
  var id = request.params.id;
  if (isNaN(id)) return response.send(400, 'ID must be a number.');
  if (id < 0) return response.send(400, 'ID must be positive.');
  if (id >= foods.length) return response.send(400, 'ID must be less than ' + foods.length);
  console.log('Sending food instance with id %s:', id);
  console.log(foods[id]);
  response.json(foods[id]);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
