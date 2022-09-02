const express = require('express')
var app = express()
const {forward,stop} = require('./motors')

const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const { spawn } = require('child_process');
var chunkingStreams = require('chunking-streams');
const { truncate } = require('fs')
 

var SeparatorChunker = chunkingStreams.SeparatorChunker;



const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
  }
})

// const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');


// const streamCamera = new StreamCamera({
//   codec: Codec.MJPEG,
//   fps: 15
// });




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


  const ls = spawn('libcamera-vid',['-t','10000','--codec', 'mjpeg', '--segment','1','-o', '-'])

  ls.stderr.on('error', (error) => {
    console.error(error);
  });
  
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  let count = 0

  // ls.stdout.on('data',(data)=>{
  //   if(count<=10){
  //     console.log(data.toString('hex').indexOf('ffd8ff'))
  //     console.log(data.toString('hex').indexOf('ffd9'))
  //     console.log(data.toString('hex').slice(0,10))
  //     console.log(data.toString('hex').slice(data.length-100,data.length))
  //     console.log('------')
  //     count+=1
  //   }
  //   socket.emit('data', "data:image/jpeg;base64," + data.toString("base64"));
  // })

  const separator = 'ffd9' 

  
  let result='';

  let sent = 0
 

  ls.stdout.on('data',(data)=>{
    const index = data.toString('hex').indexOf('ffd9')
    //if(sent<3){
      if(index===-1){
        result+=data.toString('hex')
      }
      else{
          let truncated = data.toString('hex').slice(0,index+4)
          const toSend = Buffer.from(result+truncated,'hex')
          console.log(toSend.toString('hex'))
          result=data.toString('hex').slice(index+4)
          socket.emit('data', "data:image/jpeg;base64," + toSend.toString("base64"));
          sent +=1
      }
    //}
  })

 

   
  

})




server.listen(3000, '0.0.0.0',() => {
  console.log('listening on *:3000');
});