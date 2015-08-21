//includes
//app
//routes
//views
//processing
//port

//colors in console
var colors = require('colors');
console.log('W                '.red.bgBlue);
console.log('  E              '.red.bgBlue);
console.log('    B            '.red.bgBlue);
console.log('      S          '.red.bgBlue);
console.log('        E        '.red.bgBlue);
console.log('          R      '.red.bgBlue);
console.log('            V    '.red.bgBlue);
console.log('              E  '.red.bgBlue);
console.log('                R'.red.bgBlue);
console.log('                 '.red.bgBlue);
console.log("    build v0.1   ".red.bgBlue);
console.log('                 '.red.bgBlue);
console.log(' ');
console.log('eric: colors for console loaded');

//################
//### INCLUDES ###
//################
    //express
    var express = require('express'),
        session = require('express-session');
        console.log('eric: express and sessions loaded');
//    //cookie parser
//    var cookieParser = require('cookie-parser');
//    //mongo
//    var mongoclient = require('mongodb').MongoClient,
//        format = require('util').format;
//        console.log('eric: mongoclient loaded');
//    //var MongoStore = require('connect-mongo')(session);
//        console.log('eric: mongostore loaded');
    //body parser
    var bodyParser = require('body-parser');
        console.log('eric: body-parser loaded');
    //unirest
    var unirest = require("unirest");
        console.log('eric: unirest loaded');
    //web server
    var http = require('http');
        console.log('eric: http webserver loaded');
    //pathing
    var path = require('path');
        console.log('eric: pathing loaded');
    //ejs
    var ejs = require('ejs');
        console.log('eric: ejs loaded');
    //mysql
    var mysql = require('mysql');
        console.log('eric: mysql loaded');
//    //passport
//    var passport = require('passport');
//        console.log('eric: passport loaded');
//    //passport steam
//    var SteamStrategy = require('passport-steam').Strategy;
//        console.log('eric: passport-steam strategy loaded');

//###########
//### APP ###
//###########
//define app as express
var app = express();
console.log('eric: app defined as an express application');

//test database connection
//var connection = mysql.createConnection({
//  host     : 'localhost',
//  user     : 'root',
//  password : '0dtTMHHB6S',
//  database : 'webserver'
//});
//connection.connect();
//connection.query('SELECT * from test', function(err, rows, fields) {
//  if (!err)
//    console.log('database connection succeded');
//  else
//    console.log('Error while performing test query.');
//});
//connection.end();

//set apps
app.set('views', __dirname);
app.set('view engine', 'ejs');
console.log('eric: apps have been "set"');

//use apps
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'springsteen'}));
app.use(express.static(__dirname + '/public'));
console.log('eric: apps have been "used"');

//#############
//### VIEWS ###
//#############
//default view
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/views/main.html'));
    console.log('eric: / served');
});
app.get('/test', function(req,res){
	res.sendFile(path.join(__dirname + '/views/test.html'));
    console.log('eric: /test served');
});

//############
//### PORT ###
//############
app.listen(80);
console.log("eric: webserver listening on 8080");