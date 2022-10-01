const express = require('express')
var app = express()
const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const { spawn } = require('child_process');

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



io.on('connection',(socket)=>{
  console.log('a user connected')

  socket.on('forward', (msg)=>{
    console.log('forward')
    redis_p.publish('command','forward')
  })

  socket.on('backward', (msg)=>{
    console.log('backward')
    redis_p.publish('command','backward')
  })

  socket.on('pivot_left', (msg)=>{
    console.log('pivot_left')
    redis_p.publish('command','pivot_left')
  })

  socket.on('pivot_right', (msg)=>{
    console.log('pivot_right')
    redis_p.publish('command','pivot_right')
  })

  socket.on('stop', (msg)=>{
    console.log('stop')
    console.log(msg)
    redis_p.publish('command','stop')
  })
 
  redis_s.on('message',(channel,message)=>{
    if(channel=='camera'){
      socket.emit('data', "data:image/jpeg;base64," + message.toString("base64"));
    }
  })
})






server.listen(3000, '0.0.0.0',() => {
  console.log('listening on *:3000');
});