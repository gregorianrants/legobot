import { io } from "socket.io-client";

console.log('fuck')

const socket = io.connect('http://localhost:8080/',{
        reconnection: true
})

socket.on('connect', ()=>{
        console.log('connected')
        socket.emit('ping')
})

socket.on('pong', () => {
        console.log('pong');
      });

socket.on('disconnect', () => {
       console.log('connected')
      });