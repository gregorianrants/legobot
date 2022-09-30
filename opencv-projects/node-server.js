const express = require('express')
var app = express()
const cors = require('cors')
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const { spawn } = require('child_process');

const io = new Server(server,{
  cors: {
    origin: "http://localhost:3000",
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const ls = spawn('python3',['main.py'],  {stdio: ['ignore', 'pipe', process.stderr]}); 

io.on('connection',(socket)=>{
  console.log('a user connected')
 
  ls.stdout.on('error', (error) => {
    console.error(error);
  });

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  ls.stdout.on('data',(data)=>{
        socket.emit('data', "data:image/jpeg;base64," + data.toString("base64"));
  })
})


server.listen(3000, '0.0.0.0',() => {
  console.log('listening on *:3000');
});