const fs = require ('fs');
const path = require('path');
const express = require('express');
const app = express();
const http = require ('http').Server(app);
const io = require ('socket.io').listen(http);
const logger = require('morgan');
const bodyParser = require('body-parser');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
	res.status(200);
  res.sendfile(__dirname + '/public/index.html');
});
app.get('/configuration', function (req, res) {
	res.status(200);
  res.sendfile(__dirname + '/server/config.json');
});
//error not found
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
//if dev show stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: {}
	});
});
http.listen(9000, function(){
	console.log('Application running!\nListening on port 9000');
});


io.on ('connection', function (socket) {
  var re_addr = socket.request.connection.remoteAddress+':'+socket.request.connection.remotePort;
  var hndsh = socket.handshake, date = new Date ();
  console.log ('-- Client '+re_addr+' connected ['+socket.nsp.name+'] on '+ date + ' --');
  console.log ('  sockID = '+socket.id+ '  htmlcookie = ', hndsh.headers.cookie);
  console.log ('  Total server clients = '+ socket.conn.server.clientsCount);

  socket.on ('disconnect', function () {
    console.log ('-- Client '+re_addr+' disconnected ['+socket.nsp.name+'] --');
    console.log ('  Total server clients = '+ socket.conn.server.clientsCount);
  });
  socket.on('saveGame', function(savedState) {
	console.log("SAVING GAME", savedState);
	fs.writeFile("server/config.json", JSON.stringify(savedState,undefined,2),function (err) {
		if (err) {
			console.error(err);
		}
	});
  });
});

