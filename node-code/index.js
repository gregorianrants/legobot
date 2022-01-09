const express = require('express')
var app = express()
const {forward,stop} = require('./motors')

const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
  }
})

const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');


const streamCamera = new StreamCamera({
  codec: Codec.MJPEG,
  fps: 15
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection',(socket)=>{
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('forward', (msg)=>{
    console.log('forward')
    forward()
  })

  socket.on('stop', (msg)=>{
    console.log('message' + msg)
    stop()
  })

  streamCamera.on('frame', (data) => {
    socket.emit('data', "data:image/jpeg;base64," + data.toString("base64"));
  });
})




async function cameraStartCapture() {
  await streamCamera.startCapture();
}

async function cameraStopCapture() {
  await streamCamera.stopCapture();
}

cameraStartCapture().then(() => {
  console.log('Camera is now capturing');
});

server.listen(3000, '0.0.0.0',() => {
  console.log('listening on *:3000');
});