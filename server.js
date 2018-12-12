var app = require('express')();
var http = require('http').Server(app);
var fs = require('fs');
var Handlebars = require('handlebars');

var source = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

</head>
<body>
    <script type="text/javascript" src="node_modules/socket.io-client/dist/socket.io.js"></script>
    <script>
    var socket = io("http://localhost:80");
    socket.on('fileChanged', function(msg){
        document.getElementById("ma").innerHTML= msg;
    });
    </script>
    <div id="ma">{{name}}</div>
</body>
</html>`;

var template = Handlebars.compile(source);

app.get('/', function(req, res) {
  let content;
  fs.readFile('./file.log', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data.toString();
    var result = template({ "name": content});
    fs.writeFile("test.html", result, function(err) {
      if(err) {
          return console.log(err);
      }
      res.setHeader('content-type', 'text/html');
      res.sendFile(__dirname + '/test.html');
    });
  });
});

const io = require('socket.io')(http);
    io.on('connection',function (client) {
    console.log("Socket connection is ON!");
});

fs.watchFile('file.log', function(curr, prev) {
  // file changed push this info to client.
  console.log("file Changed");
  io.emit('fileChanged', 'yea file has been changed.');
});

http.listen(8081, function(){
    console.log('listening on *:80');
});