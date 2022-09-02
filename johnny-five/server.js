const express = require('express')
var app = express()


const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")

const motors = require('./motors.js')

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
  }
})

const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');
const { SocketAddress } = require('net');

const streamCamera = new StreamCamera({
  codec: Codec.MJPEG,
  fps: 10
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

function setUpMotors(socket,motors){
        const speed = 60

        socket.on('forward', (msg)=>{
                console.log('forward')
                motors.forward(speed)
                })

        socket.on('reverse',()=>{
                motors.reverse(speed)
        })

        socket.on('pivotLeft',()=>{
                motors.pivotLeft(speed-20)
        })

        socket.on('pivotRight',()=>{
                motors.pivotRight(speed-20)
        })

        socket.on('stop', (msg)=>{
                console.log('stop')
                motors.stop()
                })
}


io.on('connection',(socket)=>{
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  setUpMotors(socket,motors)

  
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