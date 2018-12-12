/////////////////////////////
// NodeJS Server
/////////////////////////////

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');

io.of('/user').on('connection', function(socket) {
  console.log("connection");

  //send stream to client/browser

  var i = 0;
  var timer = setInterval(function() {
    console.log('file',i);
    var stream = ss.createStream();
    ss(socket).emit('file',stream, {i:i});
    var filename = 'image'+(i%2)+'.png';
    console.log(filename);
    fs.createReadStream(filename).pipe(stream);
    i++;
  },1000);

  socket.on('disconnect', function() {
    console.log('disconnect')
    clearInterval(timer);
  })

});

app.use(express.static(__dirname, '/'));

http.listen(8080, function(){
  console.log('listening on *:8080');
});

// /////////////////////////////
// // JavaScript for Browser
// /////////////////////////////

// <input id="file" type="file" />
// <img id="img">
// <script src="jquery-2.1.1.js"></script>
// <script src="socket.io/socket.io.js"></script>
// <script src="socket.io-stream.js"></script>
// <script>

// $(document).ready(function() {
  
//   $(function() {
//     var socket = io.connect('http://localhost:8080/user');

//     socket.on("connect",function() {
//       console.log("on connect");

//       ss(socket).on('file', function(stream,data) {
//         console.log('received',data);

//         var binaryString = "";

//         stream.on('data', function(data) {
//           console.log('data')

//           for(var i=0;i<data.length;i++) {
//             binaryString+=String.fromCharCode(data[i]);
//           }

//         });

//         stream.on('end', function(data) {
//           console.log('end')
//           $("#img").attr("src","data:image/png;base64,"+window.btoa(binaryString));

//           binaryString = "";
//         });
//       });
//     });
//   });
// });

// </script>