/*
 * Monitor remote server uptime.
 */

var mongoose = require('mongoose'),
    express  = require('express'),
    api      = require('./routes/api'),
    monitor  = require('./lib/monitor');

// configure mongodb
var mongodbUser = 'root';
var mongodbPassword = '';
var mongodbServer = 'localhost';
var mongodbDatabase = 'uptime';
mongoose.connect('mongodb://' + mongodbUser + ':' + mongodbPassword + '@' + mongodbServer +'/' + mongodbDatabase);

// poll checks every 2 seconds and update the QoS score every 5 seconds
m = monitor.createMonitor(2000, 5000);
m.start();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  var oneYear = 31557600000;
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
  app.use(express.errorHandler());
});

// Routes

app.get('/api/check',       api.checkAll);
app.get('/api/check/:name', api.checkOne);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);