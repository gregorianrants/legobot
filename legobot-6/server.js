const express = require('express')
var app = express()
const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const { spawn } = require('child_process');
const motors = require('./motors.js');

const Redis = require('ioredis')

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const redis_s = new Redis()
const CAMERA_CHANNEL = 'camera'
redis_s.subscribe(CAMERA_CHANNEL )

const redis_p = new Redis()

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
  
    
    redis_s.on('message',(channel,message)=>{
      if(channel=='camera'){
        socket.emit('data', "data:image/jpeg;base64," + message.toString("base64"));
      }
    })
  })








server.listen(3000, '0.0.0.0',() => {
  console.log('listening on *:3000');
});