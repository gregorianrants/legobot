// const fs = require('fs')

// fs.readFile('test00000.jpeg','hex',(err,data)=>{
//         console.log(data.length)
//         console.log('0')
//         console.log(data.slice(0,100))
//         console.log(data.slice(data.length-100,data.length))
//         console.log('------')
// })

// console.log('split')

// fs.readFile('test00001.jpeg','hex',(err,data)=>{
//         console.log(data.length)
//         console.log('1')
//         console.log(data.slice(0,100))
//         console.log(data.slice(data.length-100,data.length-1))
//         console.log('------')
// })

// fs.readFile('test00003.jpeg','hex',(err,data)=>{
//         console.log(data.length)
//         console.log('3')
//         console.log(data.slice(0,100))
//         console.log(data.slice(data.length-100,data.length-1))
//         console.log('------')
// })

const first = Buffer.from('ffd9','hex')

console.log(first)


