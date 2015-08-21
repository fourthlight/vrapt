//////////////
// REQUIRES //
//////////////

    //optimist
    //net
    //tls
    //events
    //express
    //file system
    //simple sets
    //mysql
    //logging
    //session
    //room
    
    //total connected var
    //user list array
var colors = require('colors');
console.log('J                      '.trap.red.bgBlue);
console.log('  A                    '.trap.red.bgBlue);
console.log('    N                  '.trap.red.bgBlue);
console.log('      U                '.trap.red.bgBlue);
console.log('        S              '.trap.red.bgBlue);
console.log('                       '.trap.red.bgBlue);
console.log('            S          '.trap.red.bgBlue);
console.log('              E        '.trap.red.bgBlue);
console.log('                R      '.trap.red.bgBlue);
console.log('                  V    '.trap.red.bgBlue);
console.log('                    E  '.trap.red.bgBlue);
console.log('                      R'.trap.red.bgBlue);
console.log('                       '.trap.red.bgBlue);
console.log("   Eric's build v0.1   ".trap.red.bgBlue);
console.log('                       '.trap.red.bgBlue);
console.log(' ');
console.log('eric: colors for console loaded');

var args = require('optimist').argv,
    config = require(args.config || './config.js'),
    net = require('net'),
    tls = require('tls'),
    events = require('events'),
    express = require('express'),
    fs = require('fs'),
    sets = require('simplesets'),
    mysql = require('mysql');
    global.log = require('./src/Logging');
var Session = require('./src/Session'),
    Room = require('./src/Room'),
    totalConnected = 0,
    userList = [];
        
/////////////////////
// SERVER FUNCTION //
/////////////////////

    //sets sessions
    //instantiates private rooms object
    //run update user list prototype
    //update interval?
    //update username and pass list every 5 min

function Server(){
    //set sessions
    this._sessions = new sets.Set();
    //instantiate private rooms object
    this._rooms = {};
    //update user list
    this.updateUserList();
    //some type of interval?
    var UIUInt = (config.UserInfo_updateInterval*60)*1000;
    //update username and pass list every 5 min
    var timerId = setInterval(this.updateUserList, UIUInt);
};
////////////////////
// SERVER METHODS //
////////////////////

    //get rooms
    //is name free
    //start
    //startWebServer - self = this
    //onConnect - self = this
    //access_log
    //users online
    //users in room***
    //get user info

//server get room, takes roomId
Server.prototype.getRoom = function(roomId){
    //if private rooms sub roomId is undefined
    if(this._rooms[roomId] === undefined){
        //set private rooms sub roomId to new room with roomId
        this._rooms[roomId] = new Room(roomId);
    }
    //return private rooms sub roomId
    return this._rooms[roomId];
};
//check if username is free, takes a name
Server.prototype.isNameFree = function(name){
    var free = true;
    this._sessions.each(function(s){
        if(s.id === name){
            free = false;
        }
    });
    //free returns true or false
    return free;
};
//start socket server
Server.prototype.start = function(){
    //logging
    console.log('========================');
    console.log('Janus VR Presence Server');
    console.log("    Eric's Build v0.1   ");
    console.log('========================');
    log.info('Start time: ' + Date());
    //console.log('See server.log for activity information and config.js for configuration');
    console.log('Log level: ' + config.logLevel);
    //define server
    this.server = net.createServer(this.onConnect.bind(this));
    //start server listening
    this.server.listen(config.port, function(err){
        //error handling
        if(err){
            log.error('Socket Server error listening on port: ' + config.port);
            process.exit(1);
        }
        //logging
        log.info('Socket Server listening on port: ' + config.port);
        console.log('Socket Server listening on port: ' + config.port);
    });
    //if ssl
    if(config.ssl){
        this.ssl = tls.createServer(config.ssl.options, this.onConnect.bind(this));
        this.ssl.listen(config.ssl.port, function(err){
            if(err){
                log.error('SSL Server error listening on port: ' + config.ssl.port);
                process.exit(1);
            }
            console.log('SSL Server listening on port: ' + config.ssl.port);
            log.info('SSL Server listening on port: ' + config.ssl.port);
        });
    }
    //run start web server
    //this.startWebServer();
};
//start web server
Server.prototype.startWebServer = function(){
    //define self
    var self = this;
    //use express for web server
    this.ws = express();
    //express router
    var router = express.Router();
    //router get /log
    router.get('/log', function(req,res){
        res.writeHead(200, {'Content-Type':'text/plain', 'Content-Length':-1, 'Transfer-Encoding': 'chunked'});
        var logFile = fs.createReadStream('server.log');
        logFile.pipe(res);
    });
    //router get /
    router.get('/', function(req,res){
        res.send(200, 'Nothing to see here ... yet');
    });
    //tell express to use router
    this.ws.use(router);
    //tell express to listen
    this.ws.listen(config.webServer);
    //logging
    log.info('Webserver started on port: ' + config.webServer);
    console.log('Start Date/Time: ' + Date());
};
//action on client connection
Server.prototype.onConnect = function(socket){
    //define self
    var self = this;
    //define socket remote address
    var addr = socket.remoteAddress;
    //increment total connections
    totalConnected++;
    //logging
    log.info('Client connected ' + addr);
    //if access status is 1
    if(config.access_stats === 1){
        //access log address
        this.access_log(addr);
    }
    //instantiate a new session with socket
    var s = new Session(this, socket);
    //add new session to private sessions
    this._sessions.add(s);
    //on socket close function
    socket.on('close', function(){
        //decrement total connections
        totalConnected--;
        //logging
        log.info('Client disconnected: ' + addr);
        //remove session
        self._sessions.remove(s);
    });
    //on socket error
    socket.on('error', function(err){
        //logging
        log.error(addr);
        log.error('Socket error: ', err);
    });
};
//log access
Server.prototype.access_log = function(addr){
    //create var for mysql database connection
    var dbcon = mysql.createConnection({
        database : config.MySQL_Database,
        host     : config.MySQL_Hostname,
        user     : config.MySQL_Username,
        password : config.MySQL_Password,
    });
    //connect to mysql database
    dbcon.connect();
    //define post object with ip
    var post = {ip: addr};
    //query database
    dbcon.query(
        //interesting sql insert statement, using post var and a function?
        'INSERT INTO access_statistics SET ?', post, function(err, results){
    });
    //log.info("access statistics");
    dbcon.end();
}
//return global client count connected to server
Server.prototype.usersonline = function(){
    //return total connected
    return totalConnected;
};
//return client count in current room
//##########################################
//########## TODO not working yet ##########
//##########################################
Server.prototype.usersinroom = function(room){
    return 0;
};
//update user list
Server.prototype.updateUserList = function(){
    //logging
    log.info("Updating userlist");
    //create var for mysql database connection
    var dbcon = mysql.createConnection({
        database : config.MySQL_Database,
        host     : config.MySQL_Hostname,
        user     : config.MySQL_Username,
        password : config.MySQL_Password,
    });
    //while user list length is greater than 0
    while(userList.length > 0){
        //pop user list
        userList.pop();
    }
    //connect to mysql database
    dbcon.connect();
    //query database
    dbcon.query(
        //select all usernames, order descending
        'SELECT * FROM usernames ORDER BY user DESC', function(err, rows, fields){
            //for number of rows
            for(var i in rows){
                //push data to user list
                userList.push([rows[i].user, rows[i].password, rows[i].lastlogin, rows[i].isloggedin]);
            }
        }
    );
    //close databse connection
    dbcon.end();
};
//get user info, takes a username
Server.prototype.getUserInfo = function(username){
    //define return var
    var returnVar = 0;
    //loop through length of user list
    for (var i=0; i<=userList.length-1; i++){
        //if username found
        if ( userList[i][0].toLowerCase() === username.toLowerCase()){
            //return it
            returnVar = userList[i];
        }
    }
    //return something in returnVar, username maybe?
    return returnVar;
};
//////////////////
// START SERVER //
//////////////////
(new Server()).start();